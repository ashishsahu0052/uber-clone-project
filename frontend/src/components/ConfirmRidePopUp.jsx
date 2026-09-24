import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()

    const passengerName = props.ride?.userId?.fullname?.firstname
        ? `${props.ride.userId.fullname.firstname} ${props.ride.userId.fullname?.lastname || ''}`.trim()
        : (props.ride?.user?.fullname?.firstname || "Passenger");

    const pickup = props.ride?.pickup || "Pickup Location";
    const destination = props.ride?.destination || "Destination Location";
    const fare = props.ride?.fare || "193";
    const distance = props.ride?.distance ? `${props.ride.distance} KM` : "2.5 KM";

    const submitHandler = async (e) => {
        e.preventDefault()
        setErrorMsg('')

        if (!otp.trim()) {
            setErrorMsg('Please enter the OTP provided by the passenger')
            return
        }

        try {
            setIsSubmitting(true)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                rideId: props.ride._id,
                otp: otp
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride: response.data } })
            }
        } catch (error) {
            console.error("Error starting ride:", error)
            setErrorMsg(error.response?.data?.message || 'Invalid OTP or unable to start ride')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='h-full flex flex-col justify-between'>
            <div>
                <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                    props.setConfirmRidePopupPanel(false)
                }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
                
                <h3 className='text-2xl font-semibold mb-3'>Confirm this ride to Start</h3>
                
                <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-2 bg-yellow-50'>
                    <div className='flex items-center gap-3'>
                        <img className='h-12 w-12 rounded-full object-cover border border-white' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="Passenger" />
                        <h2 className='text-lg font-bold capitalize text-gray-900'>{passengerName}</h2>
                    </div>
                    <h5 className='text-lg font-bold'>{distance}</h5>
                </div>

                <div className='flex gap-2 justify-between flex-col items-center mt-2'>
                    <div className='w-full'>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="ri-map-pin-user-fill text-xl text-green-600"></i>
                            <div>
                                <h3 className='text-lg font-medium'>Pickup</h3>
                                <p className='text-sm -mt-1 text-gray-600 line-clamp-2'>{pickup}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-xl ri-map-pin-2-fill text-red-600"></i>
                            <div>
                                <h3 className='text-lg font-medium'>Destination</h3>
                                <p className='text-sm -mt-1 text-gray-600 line-clamp-2'>{destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line text-xl text-yellow-600"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{fare}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash payment</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full pb-8'>
                <form onSubmit={submitHandler}>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Ask passenger for OTP to start trip:</label>
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="text"
                        maxLength="6"
                        className='bg-[#eee] px-6 py-3 font-mono text-center tracking-widest text-2xl font-bold rounded-lg w-full outline-none focus:ring-2 focus:ring-black'
                        placeholder='Enter 4-digit OTP'
                    />

                    {errorMsg && (
                        <p className='text-red-600 text-sm mt-1 text-center font-medium'>{errorMsg}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className='w-full mt-4 text-lg flex justify-center items-center bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold p-3 rounded-lg shadow-md cursor-pointer'
                    >
                        {isSubmitting ? 'Verifying OTP...' : 'Start Trip'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => {
                            props.setConfirmRidePopupPanel(false)
                        }}
                        className='w-full mt-2 bg-red-600 hover:bg-red-700 transition-colors text-base text-white font-semibold p-2.5 rounded-lg'
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp