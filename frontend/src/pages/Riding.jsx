import React, { useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)

    useEffect(() => {
        if (!socket) return

        socket.on('ride-ended', () => {
            console.log("Passenger notified: ride has ended")
            alert('Your ride has finished! Thank you for riding with Uber.')
            navigate('/home')
        })

        return () => {
            socket.off('ride-ended')
        }
    }, [socket, navigate])

    const driverName = ride?.captain?.fullname?.firstname
        ? `${ride.captain.fullname.firstname} ${ride.captain.fullname?.lastname || ''}`.trim()
        : "Driver";
    
    const vehiclePlate = ride?.captain?.vehicle?.plate || "Vehicle";
    const vehicleDesc = `${ride?.captain?.vehicle?.color || ''} ${ride?.captain?.vehicle?.vehicleType || 'Car'}`.trim();

    return (
        <div className='h-screen flex flex-col justify-between'>
            <Link to='/home' className='fixed right-4 top-4 h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full z-10 hover:bg-gray-100 transition-colors'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>

            <div className='h-1/2'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Trip map" />
            </div>

            <div className='h-1/2 p-6 bg-white rounded-t-3xl shadow-lg flex flex-col justify-between'>
                <div>
                    <div className='flex items-center justify-between'>
                        <img className='h-14 w-20 object-contain' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Car" />
                        <div className='text-right'>
                            <h2 className='text-lg font-bold capitalize text-gray-900'>{driverName}</h2>
                            <h4 className='text-xl font-bold uppercase tracking-wider text-black'>{vehiclePlate}</h4>
                            <p className='text-sm text-gray-600 capitalize'>{vehicleDesc}</p>
                        </div>
                    </div>

                    <div className='w-full mt-4'>
                        <div className='flex items-center gap-4 p-3 border-b-2'>
                            <i className="text-xl ri-map-pin-2-fill text-red-600"></i>
                            <div>
                                <h3 className='text-sm font-semibold text-gray-400 uppercase'>Dropping Off At</h3>
                                <p className='text-base font-medium text-gray-900 line-clamp-2'>{ride?.destination || "Destination address"}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 p-3'>
                            <i className="ri-currency-line text-xl text-yellow-600"></i>
                            <div>
                                <h3 className='text-lg font-bold'>₹{ride?.fare || "193.20"}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Pay Cash to Driver upon arrival</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        alert(`Ride in progress. Please pay ₹${ride?.fare || 'fare'} in cash to your driver when you arrive at your destination.`);
                    }} 
                    className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md text-base'
                >
                    Payment Mode: Cash (₹{ride?.fare || '0'})
                </button>
            </div>
        </div>
    )
}

export default Riding