import React from 'react'
import {Link} from 'react-router-dom'
import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainLogin = () => {
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        const {captain , setCaptain} = React.useContext(CaptainDataContext)
        const navigate = useNavigate()

        const submitHandler = async  (e) =>{
            e.preventDefault()
            const captain = {
                email: email,
                password: password
            }

            const response  = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)
            if(response.status === 200) {
                const data = response.data
                const token = data.token
                localStorage.setItem('token', token)
                setCaptain(data.captain)
                navigate('/captain-home')

            }else{
                console.log(response.data.message)
            }
    
    
    
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
                <p className="text-center text-sm text-gray-600">join the fleet <Link className="font-semibold text-blue-600 hover:underline" to="/captain-signup">Register as captain</Link></p>
            </form>
        </div>
        <div className="mx-auto mt-4 max-w-md flex items-center justify-center">
            <Link to={'/login'} className="w-screen rounded-md  bg-[#10b461] px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 mr-4">
                Sign in as User 
            </Link>
        </div>

    </div> 
  )
}

export default CaptainLogin