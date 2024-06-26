import React, { useContext, useEffect, useState } from 'react'
import Login from '../../components/authComp/Login'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'


function AuthPage() {
  const {UserID}=useContext(UserContext)
  // const [SignToggle, setSignToggle] = useState(false)
  // const toggleSignMethod=()=>{setSignToggle(!SignToggle)}
  const nav=useNavigate()
  

  useEffect(()=>{if(UserID){nav('/')}},[UserID])
  return (
    <div id='registerPage'>
      <Login/>
    </div>
  )
}

export default AuthPage