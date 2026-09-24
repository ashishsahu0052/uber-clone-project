import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FinishRide = (props) => {
    const [isFinishing, setIsFinishing] = useState(false)
    const navigate = useNavigate()

    const passengerName = props.ride?.userId?.fullname?.firstname
        ? `${props.ride.userId.fullname.firstname} ${props.ride.userId.fullname?.lastname || ''}`.trim()
        : (props.ride?.user?.fullname?.firstname || "Passenger");

    const pickup = props.ride?.pickup || "Pickup address";
    const destination = props.ride?.destination || "Destination address";
    const fare = props.ride?.fare || "193";
    const distance = props.ride?.distance ? `${props.ride.distance} KM` : "2.2 KM";

    async function endRide() {
        if (!props.ride?._id) {
            navigate('/captain-home')
            return
        }

        try {
            setIsFinishing(true)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
                rideId: props.ride._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                navigate('/captain-home')
            }
        } catch (error) {
            console.error("Error ending ride:", error)
            alert(error.response?.data?.message || 'Error completing ride')
        } finally {
            setIsFinishing(false)
        }
    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            
            <h3 className='text-2xl font-semibold mb-3'>Finish this Ride</h3>
            
            <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-2 bg-yellow-50'>
                <div className='flex items-center gap-3'>
                    <img className='h-12 w-12 rounded-full object-cover border border-white' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="Passenger" />
                    <h2 className='text-lg font-bold capitalize text-gray-900'>{passengerName}</h2>
                </div>
                <h5 className='text-lg font-bold'>{distance}</h5>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center mt-3'>
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
                            <p className='text-sm -mt-1 text-gray-600'>Collect cash from passenger</p>
                        </div>
                    </div>
                </div>

                <div className='mt-6 w-full'>
                    <button
                        disabled={isFinishing}
                        onClick={endRide}
                        className='w-full text-lg flex justify-center items-center bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold p-3.5 rounded-lg shadow-md cursor-pointer'
                    >
                        {isFinishing ? 'Completing Ride...' : 'Finish Ride & Collect Cash'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FinishRide
