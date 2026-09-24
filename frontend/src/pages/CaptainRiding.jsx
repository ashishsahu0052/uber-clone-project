import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const { ride } = location.state || {}

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [finishRidePanel])

    const distance = ride?.distance ? `${ride.distance} KM away` : 'Trip in Progress';

    return (
        <div className='h-screen relative overflow-hidden'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-10'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                <Link to='/captain-home' className='h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'>
                    <i className="text-lg font-medium ri-home-5-line"></i>
                </Link>
            </div>
            
            <div className='h-4/5'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Navigation" />
            </div>

            <div 
                className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 cursor-pointer shadow-lg'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                <h5 className='p-1 text-center w-[90%] absolute top-0'>
                    <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
                </h5>
                <h4 className='text-xl font-bold text-gray-900'>{distance}</h4>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setFinishRidePanel(true);
                    }}
                    className='bg-green-600 hover:bg-green-700 text-white font-semibold p-3 px-8 rounded-lg shadow-md transition-colors'
                >
                    Complete Ride
                </button>
            </div>

            <div ref={finishRidePanelRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white px-4 py-8 rounded-t-3xl shadow-2xl'>
                <FinishRide ride={ride} setFinishRidePanel={setFinishRidePanel} />
            </div>
        </div>
    )
}

export default CaptainRiding