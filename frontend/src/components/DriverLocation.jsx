import { useEffect, useContext, useRef } from 'react'
import { SocketContext } from '../context/SocketContext'

const DriverLocation = ({ rideId, onLocationUpdate }) => {
    const { socket } = useContext(SocketContext)
    const watchIdRef = useRef(null)

    useEffect(() => {
        if (!rideId || !socket) return

        if (!('geolocation' in navigator)) {
            console.warn('Geolocation is not supported by this browser.')
            return
        }

        const successHandler = (position) => {
            const { latitude, longitude } = position.coords
            const locationData = {
                lat: latitude,
                lng: longitude
            }

            // console.log(`[Captain GPS] Emitting location for ride:${rideId}`, locationData)

            socket.emit('update-location', {
                rideId,
                location: locationData
            })

            if (onLocationUpdate) {
                onLocationUpdate(locationData)
            }
        }

        const errorHandler = (error) => {
            console.warn('[DriverLocation] Geolocation watchPosition error:', error.message)
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            successHandler,
            errorHandler,
            options
        )

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current)
                watchIdRef.current = null
                //  console.log(`[DriverLocation] Cleared watchPosition for ride:${rideId}`)
            }
        }
    }, [rideId, socket, onLocationUpdate])

    return null
}

export default DriverLocation
