import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false)
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
  const [currentRide, setCurrentRide] = useState(null)
  const [acceptedRide, setAcceptedRide] = useState(null)
  const [pendingRides, setPendingRides] = useState([])

  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)
  const location = useLocation()

  // Check if routed from CaptainRideRequests with an acceptedRide
  useEffect(() => {
    if (location.state?.acceptedRide) {
      setAcceptedRide(location.state.acceptedRide)
      setConfirmRidePopupPanel(true)
      setRidePopupPanel(false)
    }
  }, [location.state])

  // Fetch pending requests and listen to socket events
  useEffect(() => {
    const fetchPendingRides = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/pending`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setPendingRides(response.data)
      } catch (err) {
        console.error("Error fetching pending rides:", err)
      }
    }

    fetchPendingRides()

    if (!socket) return

    socket.on('new-ride', (newRide) => {
      console.log('Captain received new-ride:', newRide)
      setPendingRides(prev => {
        const exists = prev.some(r => r._id === newRide._id)
        if (exists) return prev
        return [newRide, ...prev]
      })

      // Prompt captain with popup for the incoming ride
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
        setConfirmRidePopupPanel(true)
        setPendingRides(prev => prev.filter(r => r._id !== targetRide._id))
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