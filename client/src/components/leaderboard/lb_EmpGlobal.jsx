import React, { useEffect, useState } from 'react'
import { getOptions, pageBaseUrl } from '../../utils/general'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from './leaderboard.module.css'
import { TablePagination } from '@mui/material';



function Lb_EmpGlobal() {
    const [globalBoard, setglobalBoard] = useState([])
    const [page, pagechange] = useState(0);
    const [rowperpage, rowperpagechange] = useState(5);

    const handlechangepage = (event, newpage) => {
      pagechange(newpage)
    }
    const handleRowsPerPage = (event) => {
        rowperpagechange(+event.target.value)
        pagechange(0);
    }



    useEffect(()=>{
        const globalBoardFetch=async()=>{
            try {
                const response= await fetch(`${pageBaseUrl}leaderboard/global/employee`,getOptions)
                const data=await response.json()
                if(data.globalScores){
                    console.log(data.globalScores)
                    setglobalBoard(data.globalScores)
                }
                else{
                    console.log("global_board",data)
                }

            }catch(e){
                console.log("global_board",e)

            }
        }
        globalBoardFetch()
    },[])


  
  
    return (
        <TableContainer component={Paper} sx={{border:'solid'}}>
            <h1 style={{textAlign:'center',  background:'cyan'}}>Global Employee Rank</h1>
        <Table sx={{ minWidth: 450 }} aria-label="simple table">
          <TableHead  sx={{backgroundColor:'darkcyan',color:'whitesmoke'}}>
              <TableCell sx={{flexGrow:1 ,color:'inherit'}}>rank</TableCell>
              <TableCell sx={{flexGrow:1,color:'inherit'}}>company</TableCell>
              <TableCell sx={{flexGrow:1,color:'inherit'}}>user</TableCell>
              <TableCell sx={{flexGrow:1,color:'inherit'}}>XP</TableCell>
          </TableHead>
          <TableBody>
            {globalBoard.slice(page*rowperpage,page*rowperpage+rowperpage)
            .map((row,ind) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                
              >
                <TableCell sx={{flexGrow:1}}>
                  {page*rowperpage+ind+1}.
                </TableCell>
                <TableCell sx={{flexGrow:1}} >{row.company.companyName}</TableCell>
                <TableCell sx={{flexGrow:1}}>{row.username}</TableCell>
                <TableCell sx={{flexGrow:1}}>{row.currentXP}</TableCell>
              </TableRow>
            ))}
          </TableBody>
      </Table>
      <TablePagination  
        rowsPerPageOptions={[5, 10, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={globalBoard.length}
          component="div"
          sx={{backgroundColor:'darkgray'}}
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}

      />
    </TableContainer>
    )
}

export default Lb_EmpGlobal