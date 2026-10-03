import React, { useRef, useState, useEffect, useContext } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import LiveRideMap from '../components/LiveRideMap';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/userContext';

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)

  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)

  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)

  const [fare, setFare] = useState({})
  const [vehicleType, setVehicleType] = useState('car')
  const [ride, setRide] = useState(null)
  const [isLoadingFare, setIsLoadingFare] = useState(false)
  const [isCreatingRide, setIsCreatingRide] = useState(false)
  const [detailsExpanded, setDetailsExpanded] = useState(true)
  const currentRideIdRef = useRef(null)

  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)
  const navigate = useNavigate()

  // Ensure user joins their private socket room on mount, on user load, and upon reconnect
  useEffect(() => {
    if (!socket || !user?._id) return

    socket.emit('join', { userType: 'user', userId: user._id })

    const handleConnect = () => {
      socket.emit('join', { userType: 'user', userId: user._id })
    }

    socket.on('connect', handleConnect)
    return () => {
      socket.off('connect', handleConnect)
    }
  }, [socket, user?._id])

  useEffect(() => {
    if (!socket) return

    const handleRideConfirmed = (confirmedRide) => {
      console.log('User received ride-confirmed:', confirmedRide)

      const belongsToThisRide = currentRideIdRef.current && confirmedRide?._id === currentRideIdRef.current
      const rideUserId = confirmedRide?.userId?._id || confirmedRide?.userId
      const belongsToThisUser = user?._id && rideUserId && rideUserId.toString() === user._id.toString()

      // If this client initiated a ride or is the user on the ride, proceed
      if (currentRideIdRef.current && !belongsToThisRide && !belongsToThisUser) {
        return
      }

      setRide(confirmedRide)
      currentRideIdRef.current = confirmedRide?._id
      setVehicleFound(false)
      setConfirmRidePanel(false)
      setWaitingForDriver(true)
      setDetailsExpanded(true)

      // Join the dedicated ride room for live location streaming
      if (confirmedRide?._id) {
        socket.emit('join-ride', { rideId: confirmedRide._id })
      }
    }

    const handleRideStarted = (startedRide) => {
      console.log('User received ride-started:', startedRide)
      const belongsToThisRide = (currentRideIdRef.current && startedRide?._id === currentRideIdRef.current) || (ride?._id && startedRide?._id === ride._id)
      const rideUserId = startedRide?.userId?._id || startedRide?.userId
      const belongsToThisUser = user?._id && rideUserId && rideUserId.toString() === user._id.toString()

      if (currentRideIdRef.current && !belongsToThisRide && !belongsToThisUser) {
        return
      }

      setWaitingForDriver(false)
      navigate('/riding', { state: { ride: startedRide } })
    }

    socket.on('ride-confirmed', handleRideConfirmed)
    socket.on('ride-started', handleRideStarted)

    return () => {
      socket.off('ride-confirmed', handleRideConfirmed)
      socket.off('ride-started', handleRideStarted)
    }
  }, [socket, navigate, user?._id, ride?._id])

  const handlePickupChange = async (e) => {
    const value = e.target.value
    setPickup(value)
    if (value.trim().length < 3) {
      setPickupSuggestions([])
      return
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestion`, {
        params: { input: value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setPickupSuggestions(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDestinationChange = async (e) => {
    const value = e.target.value
    setDestination(value)
    if (value.trim().length < 3) {
      setDestinationSuggestions([])
      return
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestion`, {
        params: { input: value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setDestinationSuggestions(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const findTrip = async () => {
    if (!pickup.trim() || !destination.trim()) {
      alert('Please enter both pickup and destination locations')
      return
    }

    try {
      setIsLoadingFare(true)
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      setFare(response.data)
      setPanelOpen(false)
      setVehiclePanel(true)
    } catch (error) {
      console.error("Error fetching fare:", error)
      alert(error.response?.data?.message || 'Unable to calculate fare. Please try again.')
    } finally {
      setIsLoadingFare(false)
    }
  }

  const createRide = async () => {
    try {
      setIsCreatingRide(true)
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const newRide = response.data.ride
      setRide(newRide)
      currentRideIdRef.current = newRide?._id
      setConfirmRidePanel(false)
      setVehicleFound(true)
    } catch (error) {
      console.error("Error creating ride:", error)
      alert(error.response?.data?.message || 'Error requesting ride')
    } finally {
      setIsCreatingRide(false)
    }
  }

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24
      })
      gsap.to(panelCloseRef.current, {
        opacity: 1
      })
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0
      })
      gsap.to(panelCloseRef.current, {
        opacity: 0
      })
    }
  }, [panelOpen])

  useGSAP(function () {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehiclePanel])

  useGSAP(function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePanel])

  useGSAP(function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehicleFound])

  useGSAP(function () {
    if (waitingForDriver) {
      if (detailsExpanded) {
        gsap.to(waitingForDriverRef.current, {
          transform: 'translateY(0%)',
          duration: 0.35,
          ease: 'power2.out'
        })
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: 'translateY(70%)',
          duration: 0.35,
          ease: 'power2.out'
        })
      }
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)',
        duration: 0.35
      })
    }
  }, [waitingForDriver, detailsExpanded])

  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='w-16 absolute left-5 top-5 z-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
      
      {/* Live Map shown ONLY when captain is assigned; otherwise static map */}
      {waitingForDriver && ride ? (
        <div className='h-screen w-screen absolute inset-0 z-0'>
          <LiveRideMap ride={ride} userType="user" />
        </div>
      ) : (
        <div className='h-screen w-screen'>
          <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Map" />
        </div>
      )}

      {!waitingForDriver && (
        <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
          <div className='min-h-[30%] p-6 bg-white relative rounded-t-3xl shadow-lg'>
            <h5 ref={panelCloseRef} onClick={() => {
              setPanelOpen(false)
            }} className='absolute opacity-0 right-6 top-6 text-2xl cursor-pointer hover:text-gray-600'>
              <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <h4 className='text-2xl font-semibold'>Find a trip</h4>
            <form className='relative py-3' onSubmit={(e) => {
              e.preventDefault();
              findTrip();
            }}>
              <div className="line absolute h-16 w-1 top-[42%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
              <input
                onClick={() => {
                  setPanelOpen(true)
                  setActiveField('pickup')
                }}
                value={pickup}
                onChange={handlePickupChange}
                className='bg-[#eee] px-12 py-2 text-base rounded-lg w-full outline-none focus:ring-2 focus:ring-black'
                type="text"
                placeholder='Add a pick-up location'
              />
              <input
                onClick={() => {
                  setPanelOpen(true)
                  setActiveField('destination')
                }}
                value={destination}
                onChange={handleDestinationChange}
                className='bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3 outline-none focus:ring-2 focus:ring-black'
                type="text"
                placeholder='Enter your destination'
              />

              {/* Prominent Action Button after selecting pickup and destination */}
              {pickup.trim().length > 0 && destination.trim().length > 0 && (
                <button
                  type="button"
                  onClick={findTrip}
                  disabled={isLoadingFare}
                  className='w-full mt-4 bg-black hover:bg-gray-800 transition-all text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md'
                >
                  {isLoadingFare ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-lg"></i>
                      <span>Calculating Fare...</span>
                    </>
                  ) : (
                    <>
                      <span>Find Trip</span>
                      <i className="ri-arrow-right-line text-lg"></i>
                    </>
                  )}
                </button>
              )}
            </form>
          </div>

          <div ref={panelRef} className='bg-white h-0 overflow-y-auto transition-all'>
            <LocationSearchPanel
              suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
              setPanelOpen={setPanelOpen}
              setVehiclePanel={setVehiclePanel}
              setPickup={setPickup}
              setDestination={setDestination}
              activeField={activeField}
            />
          </div>
        </div>
      )}

      <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-8 rounded-t-3xl shadow-2xl'>
        <VehiclePanel
          fare={fare}
          selectVehicle={setVehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 rounded-t-3xl shadow-2xl'>
        <ConfirmRide
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          createRide={createRide}
          isCreatingRide={isCreatingRide}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 rounded-t-3xl shadow-2xl'>
        <LookingForDriver
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>

      <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-4 rounded-t-3xl shadow-2xl'>
        <WaitingForDriver
          ride={ride}
          setWaitingForDriver={setWaitingForDriver}
          isExpanded={detailsExpanded}
          toggleExpand={() => setDetailsExpanded(prev => !prev)}
        />
      </div>
    </div>
  )
}

export default Home