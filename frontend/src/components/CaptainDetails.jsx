import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = (props) => {
    const { captain: contextCaptain } = useContext(CaptainDataContext)
    const captain = props.captain || contextCaptain

    const captainName = captain?.fullname?.firstname
        ? `${captain.fullname.firstname} ${captain.fullname.lastname || ''}`.trim()
        : 'Captain'

    const earnings = captain?.earnings !== undefined ? Number(captain.earnings) : 0
    const hours = captain?.hoursOnline !== undefined ? Number(captain.hoursOnline) : 0
    const trips = captain?.completedTrips !== undefined ? Number(captain.completedTrips) : 0

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="Captain" />
                    <h4 className='text-lg font-medium capitalize'>{captainName}</h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹{earnings.toFixed(2)}</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>{hours.toFixed(1)}</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>0.0</h5>
                    <p className='text-sm text-gray-600'>KM Driven</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>{trips}</h5>
                    <p className='text-sm text-gray-600'>Trips Done</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails