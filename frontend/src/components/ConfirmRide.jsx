import React from 'react'

const ConfirmRide = (props) => {
    const vehicleImage = props.vehicleType === 'moto'
        ? "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
        : props.vehicleType === 'auto'
        ? "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
        : "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg";

    const currentFare = props.fare?.[props.vehicleType] || props.fare?.car || '193';

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setConfirmRidePanel(false)
                props.setVehiclePanel?.(true)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>

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
                <button
                    disabled={props.isCreatingRide}
                    onClick={() => {
                        props.createRide?.()
                    }}
                    className='w-full mt-4 bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold p-3 rounded-lg text-lg flex justify-center items-center gap-2 cursor-pointer shadow-md'
                >
                    {props.isCreatingRide ? 'Requesting Ride...' : 'Confirm Ride'}
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide