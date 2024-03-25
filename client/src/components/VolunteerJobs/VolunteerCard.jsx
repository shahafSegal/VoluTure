import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './VolunteerCard.module.css'; // Import CSS module for styling
import { pageBaseUrl } from '../../utils/general';

function VolunteerCard() {
  const [volunteerJobs, setVolunteerJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${pageBaseUrl}api/v1/volunteerJobs`);
        setVolunteerJobs(response.data);
      } catch (error) {
        console.error('Error fetching volunteer jobs:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.cardContainer}>
      {volunteerJobs.map((volunteerJob, index) => (
        <div key={index} className={styles.card}>
          <img src={volunteerJob.imgURL} alt="Volunteer Job" className={styles.image} />
          <div className={styles.details}>
            <h3 className={styles.title}>{volunteerJob.title}</h3> {/* Title */}
            <p className={styles.description}>{volunteerJob.description}</p> {/* Description */}
            <p className={styles.info}>Max Amount: {volunteerJob.maxAmount}</p> {/* Max Amount */}
            <p className={styles.info}>Start Date: {new Date(volunteerJob.startDate).toLocaleDateString()}</p> {/* Start Date */}
            <p className={styles.info}>End Date: {new Date(volunteerJob.endDate).toLocaleDateString()}</p> {/* End Date */}
            <p className={styles.info}>Estimated Hours: {volunteerJob.estimatedHours}</p> {/* Estimated Hours */}
            <p className={styles.info}>Location: {volunteerJob.location}</p> {/* Location */}
            <p className={styles.info}>Business ID: {volunteerJob.businessId}</p> {/* Business ID */}
            <p className={styles.info}>Contact Phone: {volunteerJob.contactPhone}</p> {/* Contact Phone */}
            <p className={styles.info}>XP: {volunteerJob.XP}</p> {/* XP */}
            <div className={styles.categories}>
              {volunteerJob.categories.map((category, index) => (
                <span key={index} className={styles.category}>{category}</span>
              ))}
            </div>
            <p className={styles.info}>Status: {volunteerJob.status}</p> {/* Status */}
            {/* Created At: Display createdAt if needed */}
            <button className={styles.button}>Apply</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VolunteerCard;
