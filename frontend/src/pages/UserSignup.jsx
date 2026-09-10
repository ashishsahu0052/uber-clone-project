import React from 'react'
import { useState } from 'react'
import { Link  } from 'react-router-dom'
import { UserDataContext } from '../context/userContext.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserSignup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
   // const [userData, setUserData] = useState({})
    const navigate = useNavigate()
    const {user, setUser } = React.useContext(UserDataContext)

    const submitHandler = async (event) => {
        event.preventDefault()
        const newUser = {
             fullname:{
                firstname: firstName,
                 lastname: lastName,

            },
            
            email: email,
            password: password
        }
       //console.log(userData)
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)
        
        if(response.status === 201) {
            const data = response.data
            setUser(data.user)
            navigate('/home')
        }
        setEmail('')
        setPassword('')
        setFirstName('')
        setLastName('')
        
    }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex flex-col justify-between">
        <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
            <img className="mb-6 ml-1 h-12 w-12 object-contain" src="https://icon2.cleanpng.com/lnd/20241123/fe/01a0c7a4bc31fd14d50f86a45d55c0.webp" alt="Background" />
            <form className="space-y-5" onSubmit={(e) =>{
                submitHandler(e)
            }}>

                <h3 className="text-lg font-semibold text-gray-800">What is your name?</h3>
                <div className="flex gap-3">
                    <input required
                value = {firstName}
                onChange= {(e)=>{
                    setFirstName(e.target.value)
                }}
                 className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black" type="text" placeholder='first name '/>

                 <input required 
                value = {lastName}
                onChange= {(e)=>{
                    setLastName(e.target.value)
                }}
                 className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black" type="text" placeholder='last name '/>
                    

                </div>
                <h3 className="text-lg font-semibold text-gray-800">Write your email</h3>
                <input required 
                value = {email}
                onChange= {(e)=>{
                    setEmail(e.target.value)
                    
                }}
                 className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black" type="email" placeholder='example@gmail.com'/>

                <h3 className="text-lg font-semibold text-gray-800">Write your password</h3>
                <input
                required
                value = {password}
               
                onChange= {(e)=>{
                    setPassword(e.target.value)
                    
                }} 
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black" type="password" placeholder='password' />

                <button className="w-full rounded-md bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-800">Login</button>
                <p className="text-center text-sm text-gray-600">Already an account <Link className="font-semibold text-blue-600 hover:underline" to="/login">Sign in</Link></p>
            </form>
        </div>
        <div className="mx-auto mt-4 flex w-full max-w-md items-center justify-center">
           <p>by proceeding you are agreeing to our Terms and Conditions</p>
        </div>

    </div>
  )
}

export default UserSignup