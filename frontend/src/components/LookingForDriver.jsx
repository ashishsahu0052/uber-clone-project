import React from 'react'

const LookingForDriver = (props) => {
    const vehicleImage = props.vehicleType === 'moto'
        ? "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
        : props.vehicleType === 'auto'
        ? "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
        : "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg";

    const currentFare = props.fare?.[props.vehicleType] || props.fare?.car || '193';

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setVehicleFound(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Looking for a Driver</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-24 w-32 object-contain' src={vehicleImage} alt={props.vehicleType} />
                <div className='w-full mt-3'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-xl text-green-600"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600 line-clamp-2'>{props.pickup || "Pickup address"}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-xl ri-map-pin-2-fill text-red-600"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600 line-clamp-2'>{props.destination || "Destination address"}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-xl text-yellow-600"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{currentFare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash payment to driver</p>
                        </div>
                    </div>
                </div>

                {/* Status indicator and action at bottom */}
                <div className='w-full mt-2'>
                    <div className='w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-gray-100 rounded-xl text-gray-800 font-medium text-sm border border-gray-200 shadow-xs'>
                        <span className='relative flex h-3 w-3'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                            <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
                        </span>
                        <span>Connecting to nearby drivers...</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            props.setVehicleFound(false)
                            props.setConfirmRidePanel?.(true)
                        }}
                        className='w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors cursor-pointer border border-red-200'
                    >
                        Cancel Request
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver