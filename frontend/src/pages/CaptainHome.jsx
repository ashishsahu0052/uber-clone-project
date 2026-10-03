import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import LiveRideMap from '../components/LiveRideMap'
import DriverLocation from '../components/DriverLocation'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false)
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
  const [currentRide, setCurrentRide] = useState(null)
  const [acceptedRide, setAcceptedRide] = useState(null)
  const [pendingRides, setPendingRides] = useState([])
  const [captainDetailsExpanded, setCaptainDetailsExpanded] = useState(true)

  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)
  const captainRidePanelRef = useRef(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)
  const location = useLocation()

  // Check if routed from CaptainRideRequests with an acceptedRide
  useEffect(() => {
    if (location.state?.acceptedRide) {
      const rideData = location.state.acceptedRide
      setAcceptedRide(rideData)
      setCaptainDetailsExpanded(true)
      setRidePopupPanel(false)
      if (socket && rideData._id) {
        socket.emit('join-ride', { rideId: rideData._id })
      }
    }
  }, [location.state, socket])

  // Emit join event for captain so socket rooms are properly registered
  useEffect(() => {
    if (!socket || !captain?._id) return

    socket.emit('join', { userType: 'captain', userId: captain._id })

    const handleConnect = () => {
      socket.emit('join', { userType: 'captain', userId: captain._id })
      if (acceptedRide?._id) {
        socket.emit('join-ride', { rideId: acceptedRide._id })
      }
    }

    socket.on('connect', handleConnect)
    return () => {
      socket.off('connect', handleConnect)
    }
  }, [socket, captain, acceptedRide?._id])

  // Listen to socket events for real-time ride requests only
  useEffect(() => {
    if (!socket) return

    socket.on('new-ride', (newRide) => {
      console.log('Captain received real-time new-ride:', newRide)
      setPendingRides(prev => {
        const exists = prev.some(r => r._id === newRide._id)
        if (exists) return prev
        return [newRide, ...prev]
      })

      // Prompt captain with popup for the incoming real-time ride
      setCurrentRide(newRide)
      setRidePopupPanel(true)
    })

    socket.on('ride-taken', ({ rideId }) => {
      setPendingRides(prev => prev.filter(r => r._id !== rideId))
      setCurrentRide(prev => {
        if (prev?._id === rideId) {
          setRidePopupPanel(false)
          return null
        }
        return prev
      })
    })

    return () => {
      socket.off('new-ride')
      socket.off('ride-taken')
    }
  }, [socket])

  const acceptRide = async (rideToAccept) => {
    const targetRide = rideToAccept || currentRide
    if (!targetRide?._id) return

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
        rideId: targetRide._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.status === 200) {
        setAcceptedRide(response.data)
        setRidePopupPanel(false)
        setCaptainDetailsExpanded(true)
        setPendingRides(prev => prev.filter(r => r._id !== targetRide._id))
        
        // Join ride room
        if (socket && targetRide._id) {
          socket.emit('join-ride', { rideId: targetRide._id })
        }
      }
    } catch (error) {
      console.error("Error accepting ride:", error)
      alert(error.response?.data?.message || 'Ride could not be accepted')
      setRidePopupPanel(false)
    }
  }

  const ignoreRide = (rideToIgnore) => {
    const targetId = rideToIgnore?._id || currentRide?._id
    setRidePopupPanel(false)
    if (targetId) {
      setPendingRides(prev => prev.filter(r => r._id !== targetId))
    }
    setCurrentRide(null)
  }

  useGSAP(function () {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [ridePopupPanel])

  useGSAP(function () {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePopupPanel])

  useGSAP(function () {
    if (acceptedRide) {
      if (captainDetailsExpanded) {
        gsap.to(captainRidePanelRef.current, {
          transform: 'translateY(0%)',
          duration: 0.35,
          ease: 'power2.out'
        })
      } else {
        gsap.to(captainRidePanelRef.current, {
          transform: 'translateY(70%)',
          duration: 0.35,
          ease: 'power2.out'
        })
      }
    } else if (captainRidePanelRef.current) {
      gsap.to(captainRidePanelRef.current, {
        transform: 'translateY(100%)',
        duration: 0.35
      })
    }
  }, [acceptedRide, captainDetailsExpanded])

  return (
    <div className='h-screen relative overflow-hidden'>
      {/* Top Navigation Bar */}
      <div className='fixed p-4 top-0 flex items-center justify-between w-screen z-20'>
        <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
        
        <div className='flex items-center gap-3'>
          {/* Link to Ride Requests Page */}
          <Link
            to='/captain-requests'
            className='bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md text-black px-3.5 py-1.5 rounded-full font-semibold text-xs flex items-center gap-2 hover:bg-gray-100 transition-all'
          >
            <span className='relative flex h-2.5 w-2.5'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500'></span>
            </span>
            <span>{pendingRides.length} Available Request{pendingRides.length !== 1 ? 's' : ''}</span>
          </Link>

          <Link to='/captain/logout' className='h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'>
            <i className="text-lg font-medium ri-logout-box-r-line"></i>
          </Link>
        </div>
      </div>

      {/* Mount DriverLocation when ride is accepted to broadcast live GPS */}
      {acceptedRide?._id && (
        <DriverLocation rideId={acceptedRide._id} />
      )}

      {/* Map Area */}
      {acceptedRide ? (
        <div className='h-screen w-screen absolute inset-0 z-0'>
          <LiveRideMap ride={acceptedRide} userType="captain" />
        </div>
      ) : (
        <>
          <div className='h-3/5'>
            <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Map View" />
          </div>

          <div className='h-2/5 p-6 bg-white rounded-t-3xl shadow-lg relative'>
            {/* Banner notifying of pending rides */}
            {pendingRides.length > 0 && !ridePopupPanel && (
              <div className='mb-4 p-3 bg-yellow-50 border border-yellow-400 rounded-xl flex items-center justify-between shadow-xs'>
                <div className='flex items-center gap-2.5'>
                  <i className="ri-notification-3-fill text-yellow-600 text-lg"></i>
                  <div>
                    <p className='text-xs font-bold text-gray-900'>{pendingRides.length} passenger{pendingRides.length > 1 ? 's' : ''} requesting a ride</p>
                    <p className='text-xs text-gray-500'>You can pick and choose any ride</p>
                  </div>
                </div>
                <Link
                  to='/captain-requests'
                  className='bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors'
                >
                  View Rides
                </Link>
              </div>
            )}

            <CaptainDetails captain={captain} />
          </div>
        </>
      )}

      {/* Accepted Ride Bottom Details Panel with Expand/Collapse Handle */}
      {acceptedRide && (
        <div ref={captainRidePanelRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white px-4 py-3 rounded-t-3xl shadow-2xl'>
          {/* Small handle/arrow at bottom of map */}
          <div 
            className='py-1 text-center w-full cursor-pointer flex flex-col items-center justify-center hover:opacity-80 transition-opacity'
            onClick={() => setCaptainDetailsExpanded(prev => !prev)}
          >
            <span className='w-12 h-1.5 bg-gray-300 rounded-full mb-1'></span>
            <i className={`text-2xl text-gray-500 transition-transform ${captainDetailsExpanded ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line'}`}></i>
          </div>

          {/* Passenger info */}
          <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-xl mt-1'>
            <div className='flex items-center gap-3'>
              <img className='h-12 w-12 rounded-full object-cover border-2 border-white' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="Passenger" />
              <div>
                <h2 className='text-lg font-bold capitalize text-gray-900'>
                  {acceptedRide.userId?.fullname?.firstname
                    ? `${acceptedRide.userId.fullname.firstname} ${acceptedRide.userId.fullname?.lastname || ''}`.trim()
                    : (acceptedRide.user?.fullname?.firstname || "Passenger")}
                </h2>
                <span className='text-xs font-semibold px-2 py-0.5 rounded-full bg-black text-white uppercase'>
                  {acceptedRide.vehicleType || 'Car'}
                </span>
              </div>
            </div>
            <h5 className='text-base font-bold text-gray-900'>
              {acceptedRide.distance ? `${acceptedRide.distance} KM` : "2.5 KM"}
            </h5>
          </div>

          {/* Route & fare details */}
          <div className='w-full mt-2'>
            <div className='flex items-center gap-4 p-2.5 border-b'>
              <i className="ri-map-pin-user-fill text-xl text-green-600"></i>
              <div className='min-w-0 flex-1'>
                <h3 className='text-xs font-semibold text-gray-400 uppercase'>Pickup</h3>
                <p className='text-sm text-gray-800 font-medium truncate'>{acceptedRide.pickup}</p>
              </div>
            </div>
            <div className='flex items-center gap-4 p-2.5 border-b'>
              <i className="text-xl ri-map-pin-2-fill text-red-600"></i>
              <div className='min-w-0 flex-1'>
                <h3 className='text-xs font-semibold text-gray-400 uppercase'>Destination</h3>
                <p className='text-sm text-gray-800 font-medium truncate'>{acceptedRide.destination}</p>
              </div>
            </div>
            <div className='flex items-center gap-4 p-2.5'>
              <i className="ri-currency-line text-xl text-yellow-600"></i>
              <div>
                <h3 className='text-lg font-bold text-gray-900'>₹{acceptedRide.fare}</h3>
                <p className='text-xs text-gray-500'>Collect upon trip completion</p>
              </div>
            </div>
          </div>

          {/* Phase 1 Start Ride Button (UI ONLY - no backend/socket logic in Phase 1) */}
          <button
            type="button"
            onClick={() => {
              alert("Start Ride functionality will be implemented in Phase 2.")
            }}
            className='w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-4 rounded-xl text-lg shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2'
          >
            <i className="ri-play-circle-fill text-xl"></i>
            <span>Start Ride</span>
          </button>
        </div>
      )}

      {/* Real-time Ride Popup */}
      <div ref={ridePopupPanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-8 rounded-t-3xl shadow-2xl'>
        <RidePopUp
          ride={currentRide}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          acceptRide={acceptRide}
          ignoreRide={ignoreRide}
        />
      </div>

      {/* Confirm Ride with OTP Modal */}
      <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-30 bottom-0 translate-y-full bg-white px-4 py-8 rounded-t-3xl shadow-2xl'>
        <ConfirmRidePopUp
          ride={acceptedRide}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  )
}

export default CaptainHome