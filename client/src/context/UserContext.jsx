import React, { useState,useEffect, createContext } from 'react'
import {getOptions, optionsWithToken, pageBaseUrl, postOptions } from '../utils/general'
export const UserContext= createContext({})


export default function UserManager({children}) {

    const SignUpFunc= async(signUpObj)=>{
      console.log(signUpObj)
      console.log(`${pageBaseUrl}${signUpObj.select}/register`)
    //   try {
    //     const response= await fetch(`${pageBaseUrl}users/register`,{...postOptions,body:JSON.stringify({email,password,fullname})})
    //     const data=await response.json()
    //     if(data.message){
    //       return data.message
    //     }
    //     setUserObj({...data.user,id:data.user._id})
    //     setUserToken(data.token)
    //   } catch (error) {
    //    console.log(error)
    //    return "error"
    //   }
    //   return "success"

        
    }

    const LoginFunc=async(loginObj)=>{
      console.log(loginObj)
      try {
        const response= await fetch(`${pageBaseUrl}${loginObj.select}/login`,{...postOptions,body:JSON.stringify(loginObj)})
        const data=await response.json()
        console.log("login",data);
        if(data.message){
          return data.message
        }
        setUserObj({...data.user,id:data.user._id})
        setUserToken(data.token)
      } catch (error) {
       console.log(error) 
       return "error"
      }
      return "success"
        
    }

    const getUser=async ()=>{
      try {
        const response= await fetch(`${pageBaseUrl}employee/db`,optionsWithToken(getOptions,UserToken))
        const data=await response.json()
        if(data.message)console.log(data.message)
        if(data.link)setUserObj({...data.link});
      } catch (error) {
        console.log(error)
      }
    }
    
    const logOut=()=>{
      
      setUserToken('')
      setUserObj({})
      localStorage.removeItem('volun_token')
    };

    const[UserObj,setUserObj]=useState({id:''})
    const [UserToken,setUserToken]=useState('')

    useEffect(()=>{
      if(UserToken==''){
        setUserToken(localStorage.getItem('volun_token')??'')
      }
      else{
        localStorage.setItem('volun_token',UserToken)
        if(!UserObj.id){
          getUser()
        }
      }

    },[UserToken])


    useEffect(()=>{
      console.log(UserObj)
      console.log(UserToken)
    },[UserToken,UserObj])


    const val={SignUpFunc,LoginFunc,UserObj,UserToken,UserID:UserObj.id,setUserObj,logOut}

  
    return (
        <UserContext.Provider value={val}>
            {children}
        </UserContext.Provider>
    )
}