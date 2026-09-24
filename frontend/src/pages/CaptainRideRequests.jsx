import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SocketContext } from '../context/SocketContext'

const CaptainRideRequests = () => {
    const [rides, setRides] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [actionLoadingId, setActionLoadingId] = useState(null)
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPendingRides = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/pending`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setRides(response.data)
            } catch (error) {
                console.error("Error fetching pending rides:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPendingRides()

        if (!socket) return

        socket.on('new-ride', (newRide) => {
            console.log("New ride request received:", newRide)
            setRides((prev) => {
                const exists = prev.some(r => r._id === newRide._id)
                if (exists) return prev
                return [newRide, ...prev]
            })
        })

        socket.on('ride-taken', ({ rideId }) => {
            setRides((prev) => prev.filter(r => r._id !== rideId))
        })

        return () => {
            socket.off('new-ride')
            socket.off('ride-taken')
        }
    }, [socket])

    const acceptRide = async (ride) => {
        try {
            setActionLoadingId(ride._id)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: ride._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                // Navigate to captain home and open the confirmation panel
                navigate('/captain-home', { state: { acceptedRide: response.data } })
            }
        } catch (error) {
            console.error("Error accepting ride:", error)
            alert(error.response?.data?.message || 'Unable to accept this ride. It may have already been taken.')
            // Remove from list
            setRides(prev => prev.filter(r => r._id !== ride._id))
        } finally {
            setActionLoadingId(null)
        }
    }

    const ignoreRide = (rideId) => {
        setRides(prev => prev.filter(r => r._id !== rideId))
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col'>
            {/* Header */}
            <div className='sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between shadow-xs'>
                <div className='flex items-center gap-3'>
                    <Link to='/captain-home' className='h-9 w-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors'>
                        <i className="ri-arrow-left-line text-lg text-gray-700"></i>
                    </Link>
                    <div>
                        <h1 className='text-xl font-bold text-gray-900'>Ride Requests</h1>
                        <p className='text-xs text-gray-500'>Choose any ride to accept and start</p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200'>
                        <span className='h-2 w-2 rounded-full bg-green-500 animate-pulse'></span>
                        {rides.length} Request{rides.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Content List */}
            <div className='flex-1 p-4 max-w-2xl mx-auto w-full'>
                {isLoading ? (
                    <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
                        <i className="ri-loader-4-line text-4xl animate-spin mb-3 text-black"></i>
                        <p className='font-medium'>Finding requesting rides...</p>
                    </div>
                ) : rides.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-24 text-center px-4'>
                        <div className='relative mb-6'>
                            <div className='w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center'>
                                <i className="ri-radar-line text-4xl text-yellow-600"></i>
                            </div>
                            <div className='absolute inset-0 rounded-full border-2 border-yellow-300 animate-ping opacity-50'></div>
                        </div>
                        <h3 className='text-xl font-bold text-gray-800 mb-1'>No Ride Requests Yet</h3>
                        <p className='text-gray-500 text-sm max-w-sm mb-6'>
                            When nearby passengers request a ride, they will appear here in real-time. You can pick and choose any ride.
                        </p>
                        <Link to='/captain-home' className='bg-black hover:bg-gray-800 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors'>
                            Return to Driver Map
                        </Link>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {rides.map((ride) => {
                            const passengerName = ride.userId?.fullname?.firstname
                                ? `${ride.userId.fullname.firstname} ${ride.userId.fullname?.lastname || ''}`.trim()
                                : (ride.user?.fullname?.firstname || "Passenger");
                            
                            const distanceText = ride.distance ? `${ride.distance} KM` : "2.5 KM";
                            const isProcessing = actionLoadingId === ride._id;

                            return (
                                <div key={ride._id} className='bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                                    {/* Card Header */}
                                    <div className='flex items-center justify-between pb-3 border-b border-gray-100'>
                                        <div className='flex items-center gap-3'>
                                            <img
                                                className='h-11 w-11 rounded-full object-cover border border-gray-200'
                                                src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                                                alt="Passenger"
                                            />
                                            <div>
                                                <h4 className='font-bold text-gray-900 capitalize'>{passengerName}</h4>
                                                <span className='text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 uppercase'>
                                                    {ride.vehicleType || 'Car'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <span className='text-2xl font-black text-gray-900'>₹{ride.fare}</span>
                                            <span className='text-xs text-gray-500 block'>{distanceText}</span>
                                        </div>
                                    </div>

                                    {/* Route Details */}
                                    <div className='py-3 space-y-2.5'>
                                        <div className='flex items-start gap-3'>
                                            <i className="ri-map-pin-user-fill text-green-600 text-lg shrink-0 mt-0.5"></i>
                                            <div className='min-w-0 flex-1'>
                                                <p className='text-xs font-semibold text-gray-400 uppercase'>Pickup</p>
                                                <p className='text-sm text-gray-800 font-medium truncate'>{ride.pickup}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                            <i className="ri-map-pin-2-fill text-red-600 text-lg shrink-0 mt-0.5"></i>
                                            <div className='min-w-0 flex-1'>
                                                <p className='text-xs font-semibold text-gray-400 uppercase'>Destination</p>
                                                <p className='text-sm text-gray-800 font-medium truncate'>{ride.destination}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className='pt-3 border-t border-gray-100 grid grid-cols-3 gap-2'>
                                        <button
                                            onClick={() => ignoreRide(ride._id)}
                                            className='col-span-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors'
                                        >
                                            Ignore
                                        </button>
                                        <button
                                            disabled={isProcessing}
                                            onClick={() => acceptRide(ride)}
                                            className='col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-1.5'
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <i className="ri-loader-4-line animate-spin"></i>
                                                    <span>Accepting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="ri-check-line text-base"></i>
                                                    <span>Accept Ride</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CaptainRideRequests
