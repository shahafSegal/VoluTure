const VolunteerJob = require("../models/volunteerJob.model");
const { Employee } = require("../models/employee.model");


const volunteerJobController = {

  create: async (req, res) => {
    const body = req.body
    try{
        body.businessId = req.business.id
        const newJob = new VolunteerJob(body)
        newJob.id = newJob._id
        await newJob.save()
        res.send(body)
    }
    catch{res.status(400).send("Cant create Job")}
  },

  getAll: async (req, res) => {
    try {
      const volunteerJobs = await VolunteerJob.find();
      res.status(200).json(volunteerJobs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const volunteerJob = await VolunteerJob.findById(req.params.id).populate("businessId")
      if (!volunteerJob) {
        res.status(404).json({ message: "Volunteer job not found" });
      } else {
        res.status(200).json(volunteerJob);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateById: async (req, res) => {
    try {
      const updatedVolunteerJob = await VolunteerJob.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedVolunteerJob) {
        res.status(404).json({ message: "Volunteer job not found" });
      } else {
        res.status(200).json(updatedVolunteerJob);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteById: async (req, res) => {
    try {
      const deletedVolunteerJob = await VolunteerJob.findByIdAndDelete(
        req.params.id
      );
      if (!deletedVolunteerJob) {
        res.status(404).json({ message: "Volunteer job not found" });
      } else {
        res.status(200).json({ message: "Volunteer job deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  apply: async (req, res) => {
    try {
      const { jobId } = req.params;
      const { employeeId } = req.body;
  
      const employeeExists = await Employee.exists({ _id: employeeId });
      if (!employeeExists) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      const volunteerJob = await VolunteerJob.findById(jobId);
      if (!volunteerJob) {
        return res.status(404).json({ message: "Volunteer job not found" });
      }
  
      if (volunteerJob.applicants.length >= volunteerJob.maxAmount) {
        return res.status(400).json({ message: "Maximum number of applicants reached for this job" });
      }
  
      if (volunteerJob.applicants.includes(employeeId)) {
        return res.status(400).json({ message: "Employee has already applied for this job" });
      }
  
      volunteerJob.applicants.push(employeeId);
      await volunteerJob.save();
  
      res.status(200).json({ message: "Employee applied successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateJobStatusAndAwardXP: async (req, res) => {
    try {
      const { jobId } = req.params;

      const job = await VolunteerJob.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.status !== "active") {
        return res.status(400).json({ message: "Job is not in active" });
      }
      job.status = "completed";
      await job.save();

      const employees = await Employee.find({ _id: { $in: job.applicants } });
      employees.forEach(async (employee) => {
        employee.currentXP += 15;
        employee.totalVolunteer += 1;
        await employee.save();
      });

      res.status(200).json({
        message: "Job status updated to completed and XP awarded to employees",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateJobStatusToActive: async () => {
    try {
      const upcomingJobs = await VolunteerJob.find({ status: "upcoming" });
      const today = new Date();
      const sixAM = new Date(today);

      sixAM.setHours(6, 0, 0, 0);

      for (const job of upcomingJobs) {
        const jobStartDate = new Date(job.startDate);
        if (
          jobStartDate.getTime() === sixAM.getTime() ||
          jobStartDate.getTime() >= sixAM.getTime()
        ) {
          job.status = "active";
          await job.save();
        }
      }
    } catch (error) {
      console.error("Error updating job status to active:", error);
    }
  },

  getVolunteerByFilter: async (req, res) => {
    const { area, category, amount, city } = req.body;
    const query = {};

    if (amount) {
      query.maxAmount = new RegExp(amount, "i");
    }

    if (city) {
      query.city = new RegExp(city, "i");
    }

    if (area) {
      query.area = new RegExp(area, "i");
    }

    if (category) {
      query.categories = new RegExp(category, "i");
    }

    try {
      const volunteerJobs = await VolunteerJob.find(query);
      return res.send(volunteerJobs);
    } catch (error) {
      console.log(error);
      res.status(400).send("Error");
    }
  },
};

module.exports = volunteerJobController;
