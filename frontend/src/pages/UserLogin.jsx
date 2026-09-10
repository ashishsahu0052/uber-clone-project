import React from 'react'
//import { use } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'


const UserLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userData, setUserData] = useState({})

    const submitHandler = (e) =>{
        e.preventDefault()
        setUserData({
            email:email,
            password:password
        })

        console.log(userData)


        setEmail('')
        setPassword('')
    }


  return (

    <div className="min-h-screen bg-gray-100 px-4 py-10 flex flex-col justify-between">
        <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
            <img className="w-15 ml-1 mt-5" src="https://icon2.cleanpng.com/lnd/20241123/fe/01a0c7a4bc31fd14d50f86a45d55c0.webp" alt="Background" />
            <form className="space-y-4" onSubmit={(e) =>{
                submitHandler(e)
            }}>
                <h3 className="text-lg font-semibold text-gray-800">Write your email</h3>
                <input required 
                value = {email}
                onChange= {(e)=>{
                    setEmail(e.target.value)
                    
                }}
                 className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" type="email" placeholder='example@gmail.com'/>

                <h3 className="text-lg font-semibold text-gray-800">Write your password</h3>
                <input
                required
                value = {password}
               
                onChange= {(e)=>{
                    setPassword(e.target.value)
                    
                }} 
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black" type="password" placeholder='password' />

                <button className="w-full rounded-md bg-black px-4 py-2 font-semibold text-white hover:bg-gray-800">Login</button>
                <p className="text-center text-sm text-gray-600">New Here <Link className="font-semibold text-blue-600 hover:underline" to="/signup">Create new Account</Link></p>
            </form>
        </div>
        <div className="mx-auto mt-4 max-w-md flex items-center justify-center">
            <Link to={'/captain-login'} className="w-screen rounded-md  bg-[#10b461] px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 mr-4">
                Sign in as Captain 
            </Link>
        </div>

    </div> 
  )
}

export default UserLogin