import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {CaptainDataContext} from '../context/CaptainContext.jsx'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const CaptainSignup = () => {
const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')  
  const [password, setPassword] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState(4)
  const [vehicleType, setVehicleType] = useState('car')

  const {captain , setCaptain} = React.useContext(CaptainDataContext)
  

  

  const submitHandler = async  (event) => {
    event.preventDefault()
    
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,   
      },
      email: email,
      password: password,   
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,  
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      } 
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
    if(response.status === 201) {
      const data = response.data
      const token = data.token
      localStorage.setItem('token', token)
      setCaptain(data.captain)
      navigate('/captain-home')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
        <img
          className="mb-6 h-12 w-12 object-contain"
          src="https://icon2.cleanpng.com/lnd/20241123/fe/01a0c7a4bc31fd14d50f86a45d55c0.webp"
          alt="Uber"
      />

      <form className="space-y-4" onSubmit={submitHandler}>
          <h2 className="text-2xl font-bold text-gray-900">Create captain account</h2>

          <div className="flex gap-3">
            <input
              required
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              type="text"
              placeholder="First name"
            />
            <input
              required
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              type="text"
              placeholder="Last name"
            />
          </div>

          <input
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            type="email"
            placeholder="Email address"
          />

          <input
            required
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            type="password"
            placeholder="Password"
          />

          <h3 className="pt-2 text-lg font-semibold text-gray-800">Vehicle details</h3>

          <div className="flex gap-3">
            <input
              required
              name="vehicleColor"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              type="text"
              placeholder="Vehicle color"
            />
            <input
              required
              name="vehiclePlate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              type="text"
              placeholder="Plate number"
            />
          </div>

          <div className="flex gap-3">
            <input
              required
              min="1"
              name="vehicleCapacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              type="number"
              placeholder="Capacity"
            />
            <select
              name="vehicleType"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="truck">Auto</option>
            </select>
          </div>
          

          <button className="w-full rounded-md bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-800">
            Create captain account
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link className="font-semibold text-blue-600 hover:underline" to="/captain-login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default CaptainSignup