import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainSignup = () => {
  const [captainData, setCaptainData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    vehicleColor: '',
    vehiclePlate: '',
    vehicleCapacity: '',
    vehicleType: 'car',
  })

  const handleChange = (event) => {
    setCaptainData({ ...captainData, [event.target.name]: event.target.value })
  }

  const submitHandler = (event) => {
    event.preventDefault()
    console.log(captainData)
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
              value={captainData.firstName}
              onChange={handleChange}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              type="text"
              placeholder="First name"
            />
            <input
              required
              name="lastName"
              value={captainData.lastName}
              onChange={handleChange}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              type="text"
              placeholder="Last name"
            />
          </div>

          <input
            required
            name="email"
            value={captainData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            type="email"
            placeholder="Email address"
          />

          <input
            required
            name="password"
            value={captainData.password}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            type="password"
            placeholder="Password"
          />

          <h3 className="pt-2 text-lg font-semibold text-gray-800">Vehicle details</h3>

          <div className="flex gap-3">
            <input
              required
              name="vehicleColor"
              value={captainData.vehicleColor}
              onChange={handleChange}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              type="text"
              placeholder="Vehicle color"
            />
            <input
              required
              name="vehiclePlate"
              value={captainData.vehiclePlate}
              onChange={handleChange}
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
              value={captainData.vehicleCapacity}
              onChange={handleChange}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              type="number"
              placeholder="Capacity"
            />
            <select
              name="vehicleType"
              value={captainData.vehicleType}
              onChange={handleChange}
              className="w-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="truck">Truck</option>
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