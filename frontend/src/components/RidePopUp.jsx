import React from 'react'

const RidePopUp = (props) => {
    const passengerName = props.ride?.userId?.fullname?.firstname
        ? `${props.ride.userId.fullname.firstname} ${props.ride.userId.fullname?.lastname || ''}`.trim()
        : (props.ride?.user?.fullname?.firstname || "Passenger");

    const pickup = props.ride?.pickup || "Pickup Location";
    const destination = props.ride?.destination || "Destination Location";
    const fare = props.ride?.fare || "193";
    const distance = props.ride?.distance ? `${props.ride.distance} KM` : "2.5 KM";
    const vehicleType = props.ride?.vehicleType || "car";

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <div className='flex items-center justify-between mb-2'>
                <h3 className='text-2xl font-semibold'>New Ride Available!</h3>
                <span className='bg-black text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider'>
                    {vehicleType}
                </span>
            </div>
            
            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-3'>
                <div className='flex items-center gap-3'>
                    <img className='h-12 w-12 rounded-full object-cover border border-white' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="Passenger" />
                    <h2 className='text-lg font-bold capitalize text-gray-900'>{passengerName}</h2>
                </div>
                <h5 className='text-lg font-bold'>{distance}</h5>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-3'>
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

                <div className='mt-3 w-full flex flex-col gap-2'>
                    <button
                        onClick={() => {
                            if (props.acceptRide) {
                                props.acceptRide(props.ride)
                            } else {
                                props.setConfirmRidePopupPanel(true)
                            }
                        }}
                        className='bg-green-600 hover:bg-green-700 transition-colors w-full text-white font-semibold p-3 text-lg rounded-lg shadow-md'
                    >
                        Accept Ride
                    </button>

                    <button
                        onClick={() => {
                            if (props.ignoreRide) {
                                props.ignoreRide(props.ride)
                            } else {
                                props.setRidePopupPanel(false)
                            }
                        }}
                        className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold p-3 text-base rounded-lg transition-colors'
                    >
                        Ignore
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp