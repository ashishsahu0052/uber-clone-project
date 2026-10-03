import React from 'react'

const WaitingForDriver = (props) => {
  const captainFirstName = props.ride?.captain?.fullname?.firstname || 'Captain'
  const captainLastName = props.ride?.captain?.fullname?.lastname || ''
  const captainName = `${captainFirstName} ${captainLastName}`.trim()
  const vehiclePlate = props.ride?.captain?.vehicle?.plate || 'Active'
  const vehicleType = props.ride?.vehicleType || props.ride?.captain?.vehicle?.vehicleType || 'car'
  const vehicleDesc = props.ride?.captain?.vehicle?.color
    ? `${props.ride.captain.vehicle.color} ${vehicleType}`
    : `Uber ${vehicleType.toUpperCase()}`
  const otp = props.ride?.otp || '----'
  const fare = props.ride?.fare || '0'
  const pickup = props.ride?.pickup || 'Pickup location'
  const destination = props.ride?.destination || 'Destination location'

  const vehicleImage = vehicleType === 'moto' || vehicleType === 'bike'
    ? "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
    : vehicleType === 'auto'
    ? "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
    : "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"

  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
        if (props.setWaitingForDriver) {
          props.setWaitingForDriver(false)
        } else if (props.waitingForDriver) {
          props.waitingForDriver(false)
        }
      }}><i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i></h5>

      {/* Driver info header */}
      <div className='flex items-center justify-between mt-2 pt-2'>
        <img className='h-14 w-20 object-contain' src={vehicleImage} alt={vehicleType} />
        <div className='text-right'>
          <h2 className='text-lg font-bold capitalize text-gray-900'>{captainName}</h2>
          <h4 className='text-xl font-bold uppercase tracking-wider text-black'>{vehiclePlate}</h4>
          <p className='text-xs text-gray-500 capitalize'>{vehicleDesc}</p>
        </div>
      </div>

      {/* Prominent OTP Card */}
      <div className='my-3 p-3 bg-yellow-50 border-2 border-yellow-400 rounded-xl flex items-center justify-between shadow-xs'>
        <div>
          <span className='text-xs font-bold text-yellow-800 uppercase tracking-wider block'>Share OTP with Captain</span>
          <span className='text-xs text-gray-500'>Share this code when driver arrives</span>
        </div>
        <div className='text-2xl font-black font-mono tracking-widest text-black bg-white px-3 py-1 rounded-lg border border-yellow-300 shadow-inner'>
          {otp}
        </div>
      </div>

      {/* Route & Price Details */}
      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full'>
          <div className='flex items-center gap-4 p-3 border-b-2'>
            <i className="ri-map-pin-user-fill text-xl text-green-600"></i>
            <div className='min-w-0 flex-1'>
              <h3 className='text-xs font-semibold text-gray-400 uppercase'>Pickup</h3>
              <p className='text-sm text-gray-800 font-medium truncate'>{pickup}</p>
            </div>
          </div>
          <div className='flex items-center gap-4 p-3 border-b-2'>
            <i className="text-xl ri-map-pin-2-fill text-red-600"></i>
            <div className='min-w-0 flex-1'>
              <h3 className='text-xs font-semibold text-gray-400 uppercase'>Destination</h3>
              <p className='text-sm text-gray-800 font-medium truncate'>{destination}</p>
            </div>
          </div>
          <div className='flex items-center gap-4 p-3'>
            <i className="ri-currency-line text-xl text-yellow-600"></i>
            <div>
              <h3 className='text-lg font-bold text-gray-900'>₹{fare}</h3>
              <p className='text-xs text-gray-500'>Pay Cash to Driver upon arrival</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver