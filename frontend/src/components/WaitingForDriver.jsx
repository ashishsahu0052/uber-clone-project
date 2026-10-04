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
      {/* Top Handle / Arrow to expand or collapse details */}
      <div 
        className='py-1 text-center w-full cursor-pointer flex flex-col items-center justify-center hover:opacity-80 transition-opacity' 
        onClick={() => {
          if (props.toggleExpand) {
            props.toggleExpand()
          }
        }}
      >
        <span className='w-12 h-1.5 bg-gray-300 rounded-full mb-1'></span>
        <i className={`text-2xl text-gray-500 transition-transform ${props.isExpanded ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line'}`}></i>
      </div>

      {/* Driver info header */}
      <div className='flex items-center justify-between pt-1'>
        <img className='h-14 w-20 object-contain' src={vehicleImage} alt={vehicleType} />
        <div className='text-right'>
          <h2 className='text-lg font-bold capitalize text-gray-900'>{captainName}</h2>
          <h4 className='text-xl font-bold uppercase tracking-wider text-black'>{vehiclePlate}</h4>
          <p className='text-xs text-gray-500 capitalize'>{vehicleDesc}</p>
        </div>
      </div>

      {/* Status / OTP Card */}
      {props.ride?.status === 'ongoing' ? (
        <div className='my-3 p-3 bg-green-50 border-2 border-green-500 rounded-xl flex items-center justify-between shadow-xs'>
          <div className='flex items-center gap-2.5'>
            <span className='relative flex h-3 w-3'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-3 w-3 bg-green-600'></span>
            </span>
            <div>
              <span className='text-xs font-bold text-green-900 uppercase tracking-wider block'>Trip in Progress</span>
              <span className='text-xs text-green-700'>Heading towards your destination</span>
            </div>
          </div>
          <span className='text-xs font-bold px-2.5 py-1 bg-green-600 text-white rounded-full uppercase'>En Route</span>
        </div>
      ) : (
        <div className='my-3 p-3 bg-yellow-50 border-2 border-yellow-400 rounded-xl flex items-center justify-between shadow-xs'>
          <div>
            <span className='text-xs font-bold text-yellow-800 uppercase tracking-wider block'>Share OTP with Captain</span>
            <span className='text-xs text-gray-500'>Share this code when driver arrives</span>
          </div>
          <div className='text-2xl font-black font-mono tracking-widest text-black bg-white px-3 py-1 rounded-lg border border-yellow-300 shadow-inner'>
            {otp}
          </div>
        </div>
      )}

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
              <p className='text-xs text-gray-500'>Pay Cash or Online</p>
            </div>
          </div>
        </div>

        {/* Phase 1 Make Payment Button (UI only, no functionality) */}
        <button
          type="button"
          onClick={() => {
            alert('Payment functionality will be enabled when the ride completes.')
          }}
          className='w-full mt-2 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl text-base shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2'
        >
          <i className="ri-bank-card-line text-lg"></i>
          <span>Make Payment (₹{fare})</span>
        </button>
      </div>
    </div>
  )
}

export default WaitingForDriver