import React, { useEffect, useRef, useContext, useCallback } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import axios from 'axios'
import { SocketContext } from '../context/SocketContext'

// Haversine formula to calculate distance in meters between two points
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3 // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

const LiveRideMap = ({ ride, userType = 'user', initialCaptainLocation = null }) => {
    const mapContainerRef = useRef(null)
    const mapRef = useRef(null)
    const captainMarkerRef = useRef(null)
    const pickupMarkerRef = useRef(null)
    const destMarkerRef = useRef(null)
    const routeCoordinatesRef = useRef(null)

    const captainCoordsRef = useRef(null)
    const pickupCoordsRef = useRef(null)
    const destCoordsRef = useRef(null)
    const routeModeRef = useRef(ride?.status === 'ongoing' ? 'destination' : 'pickup')
    const mapLoadedRef = useRef(false)

    // Refs for live road-following route recalculation
    const lastRouteCalcCoordsRef = useRef(null)
    const lastRouteCalcTimeRef = useRef(0)
    const isFetchingRouteRef = useRef(false)

    const { socket } = useContext(SocketContext)

    const rideId = ride?._id
    const rideStatus = ride?.status

    // Fallback default coordinates (Bhopal / center)
    const defaultCoords = { lat: 23.2599, lng: 77.4126 }

    // Helper to draw or update OSRM GeoJSON route on the map
    const drawRoute = useCallback(async (startLngLat, endLngLat, fitBoundsOnCreate = true) => {
        if (!mapRef.current) return
        const map = mapRef.current

        try {
            isFetchingRouteRef.current = true

            let routeGeoJSON = null

            // 1. First try backend maps.service endpoint
            try {
                const token = localStorage.getItem('token')
                const backendRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-route`, {
                    params: {
                        startLng: startLngLat[0],
                        startLat: startLngLat[1],
                        endLng: endLngLat[0],
                        endLat: endLngLat[1]
                    },
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    timeout: 4000
                })

                if (backendRes.data?.geometry) {
                    routeGeoJSON = backendRes.data.geometry
                }
            } catch {
                // Fallback to direct OSRM if backend service times out or is unreachable
            }

            // 2. Direct OSRM with overview=full, geometries=geojson, steps=true
            if (!routeGeoJSON) {
                const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLngLat[0]},${startLngLat[1]};${endLngLat[0]},${endLngLat[1]}?overview=full&geometries=geojson&steps=true`
                const response = await axios.get(osrmUrl, { timeout: 6000 })

                if (response.data && response.data.code === 'Ok' && response.data.routes?.[0]?.geometry) {
                    routeGeoJSON = response.data.routes[0].geometry
                }
            }

            // 3. Draw or update route geometry on the MapLibre map
            if (routeGeoJSON && routeGeoJSON.coordinates?.length > 0) {
                routeCoordinatesRef.current = routeGeoJSON.coordinates

                const existingSource = map.getSource('osrm-route')
                if (existingSource) {
                    // Update existing source data without recreating layers
                    existingSource.setData({
                        type: 'Feature',
                        properties: {},
                        geometry: routeGeoJSON
                    })
                } else {
                    // Create source and line layer once
                    map.addSource('osrm-route', {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: routeGeoJSON
                        }
                    })

                    // Road casing line
                    map.addLayer({
                        id: 'osrm-route-casing',
                        type: 'line',
                        source: 'osrm-route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#2369daff',
                            'line-width': 7,
                            'line-opacity': 0.35
                        }
                    })

                    // Road route line
                    map.addLayer({
                        id: 'osrm-route-layer',
                        type: 'line',
                        source: 'osrm-route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#000000',
                            'line-width': 4.5,
                            'line-opacity': 0.95
                        }
                    })
                }

                // Automatically fit map bounds to the route when first created or switched
                if (fitBoundsOnCreate) {
                    const bounds = new maplibregl.LngLatBounds()
                    routeGeoJSON.coordinates.forEach(coord => bounds.extend(coord))
                    map.fitBounds(bounds, { padding: 90, maxZoom: 16 })
                }
            }
        } catch (err) {
            console.warn('[LiveRideMap] OSRM route fetch fallback:', err.message)
        } finally {
            isFetchingRouteRef.current = false
        }
    }, [])

    // Recalculate route after captain moves a meaningful distance (>= 40m) or periodically
    const checkAndRecalculateRoute = useCallback(async (currentLng, currentLat) => {
        if (isFetchingRouteRef.current) return

        const targetCoords = routeModeRef.current === 'destination'
            ? destCoordsRef.current
            : pickupCoordsRef.current

        if (!targetCoords) return

        const now = Date.now()
        const lastCoords = lastRouteCalcCoordsRef.current
        const lastTime = lastRouteCalcTimeRef.current

        let shouldRecalculate = false

        if (!lastCoords) {
            shouldRecalculate = true
        } else {
            const distanceMoved = calculateDistanceMeters(lastCoords.lat, lastCoords.lng, currentLat, currentLng)
            const timePassed = now - lastTime

            // Recalculate if moved meaningful distance (>= 40 meters) and min 5s interval,
            // or periodically every 25s if moved at least 10 meters
            if (distanceMoved >= 40 && timePassed >= 5000) {
                shouldRecalculate = true
            } else if (timePassed >= 25000 && distanceMoved >= 10) {
                shouldRecalculate = true
            }
        }

        if (shouldRecalculate) {
            lastRouteCalcCoordsRef.current = { lat: currentLat, lng: currentLng }
            lastRouteCalcTimeRef.current = now
            // Update route geometry without re-fitting camera to maintain smooth view
            await drawRoute([currentLng, currentLat], [targetCoords.lng, targetCoords.lat], false)
        }
    }, [drawRoute])

    // Switch route to destination (called when ride starts: Captain/Rider -> Destination)
    const switchToDestinationRoute = useCallback(async () => {
        if (!destCoordsRef.current || !mapRef.current) return
        routeModeRef.current = 'destination'

        const startLngLat = captainCoordsRef.current
            ? [captainCoordsRef.current.lng, captainCoordsRef.current.lat]
            : (pickupCoordsRef.current ? [pickupCoordsRef.current.lng, pickupCoordsRef.current.lat] : null)

        const endLngLat = [destCoordsRef.current.lng, destCoordsRef.current.lat]

        if (startLngLat && endLngLat) {
            // console.log('[LiveRideMap] Road-following navigation to Destination:', startLngLat, '->', endLngLat)
            lastRouteCalcCoordsRef.current = { lat: startLngLat[1], lng: startLngLat[0] }
            lastRouteCalcTimeRef.current = Date.now()
            // Fit bounds when route first switches to destination
            await drawRoute(startLngLat, endLngLat, true)
        }
    }, [drawRoute])

    // Effect to react when ride status prop changes to 'ongoing'
    useEffect(() => {
        if (rideStatus === 'ongoing' && routeModeRef.current !== 'destination' && mapLoadedRef.current) {
            switchToDestinationRoute()
        }
    }, [rideStatus, switchToDestinationRoute])

    useEffect(() => {
        if (!mapContainerRef.current) return

        // 1. Initialize MapLibre Map with free OpenStreetMap raster tiles
        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: {
                version: 8,
                sources: {
                    'osm-tiles': {
                        type: 'raster',
                        tiles: [
                            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        ],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap contributors'
                    }
                },
                layers: [
                    {
                        id: 'osm-tiles-layer',
                        type: 'raster',
                        source: 'osm-tiles',
                        minzoom: 0,
                        maxzoom: 19
                    }
                ]
            },
            center: [defaultCoords.lng, defaultCoords.lat],
            zoom: 13
        })

        mapRef.current = map

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')

        // Marker Element Creators
        const createMarkerElement = (iconClass, bgColor) => {
            const el = document.createElement('div')
            el.className = 'custom-map-marker'
            el.style.backgroundColor = bgColor
            el.style.color = '#ffffff'
            el.style.width = '36px'
            el.style.height = '36px'
            el.style.borderRadius = '50%'
            el.style.display = 'flex'
            el.style.alignItems = 'center'
            el.style.justifyContent = 'center'
            el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35)'
            el.style.border = '2.5px solid #ffffff'
            el.style.fontSize = '18px'
            el.innerHTML = `<i class="${iconClass}"></i>`
            return el
        }

        // Fetch coordinates and initialize markers
        const setupMapData = async () => {
            const token = localStorage.getItem('token')
            let pickupCoords = null
            let destCoords = null

            // Geocode Pickup
            if (ride?.pickup) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
                        params: { address: ride.pickup },
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    })
                    if (res.data?.lat && res.data?.lng) {
                        pickupCoords = res.data
                    }
                } catch (e) {
                    console.warn('Geocoding pickup failed:', e.message)
                }
            }

            // Geocode Destination
            if (ride?.destination) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
                        params: { address: ride.destination },
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    })
                    if (res.data?.lat && res.data?.lng) {
                        destCoords = res.data
                    }
                } catch (e) {
                    console.warn('Geocoding destination failed:', e.message)
                }
            }

            if (!pickupCoords) {
                pickupCoords = { lat: defaultCoords.lat, lng: defaultCoords.lng }
            }

            pickupCoordsRef.current = pickupCoords
            destCoordsRef.current = destCoords

            // Determine captain position
            const captainLat = initialCaptainLocation?.lat || ride?.captain?.location?.lat || (pickupCoords.lat - 0.012)
            const captainLng = initialCaptainLocation?.lng || ride?.captain?.location?.long || ride?.captain?.location?.lng || (pickupCoords.lng - 0.015)
            captainCoordsRef.current = { lat: captainLat, lng: captainLng }

            // 1. Captain/Driver Marker
            const captainEl = createMarkerElement('ri-car-fill', '#000000')
            captainMarkerRef.current = new maplibregl.Marker({ element: captainEl })
                .setLngLat([captainLng, captainLat])
                .addTo(map)

            // 2. Rider/Pickup Marker
            const pickupEl = createMarkerElement('ri-map-pin-user-fill', '#16a34a')
            pickupMarkerRef.current = new maplibregl.Marker({ element: pickupEl })
                .setLngLat([pickupCoords.lng, pickupCoords.lat])
                .addTo(map)

            // 3. Destination Marker (if available)
            if (destCoords) {
                const destEl = createMarkerElement('ri-map-pin-2-fill', '#dc2626')
                destMarkerRef.current = new maplibregl.Marker({ element: destEl })
                    .setLngLat([destCoords.lng, destCoords.lat])
                    .addTo(map)
            }

            mapLoadedRef.current = true

            // Route selection:
            // - Before Start Ride: Captain -> Rider/Pickup
            // - After Start Ride: Captain -> Destination
            if ((ride?.status === 'ongoing' || routeModeRef.current === 'destination') && destCoords) {
                routeModeRef.current = 'destination'
                lastRouteCalcCoordsRef.current = { lat: captainLat, lng: captainLng }
                lastRouteCalcTimeRef.current = Date.now()
                await drawRoute([captainLng, captainLat], [destCoords.lng, destCoords.lat], true)
            } else {
                routeModeRef.current = 'pickup'
                lastRouteCalcCoordsRef.current = { lat: captainLat, lng: captainLng }
                lastRouteCalcTimeRef.current = Date.now()
                await drawRoute([captainLng, captainLat], [pickupCoords.lng, pickupCoords.lat], true)
            }
        }

        map.on('load', () => {
            setupMapData()
        })

        // 4. Socket room join & live listeners
        if (socket && rideId) {
            socket.emit('join-ride', { rideId })

            const handleDriverLocation = (location) => {
                if (!location) return
                const lat = location.lat ?? location.latitude
                const lng = location.lng ?? location.longitude

                if (typeof lat === 'number' && typeof lng === 'number') {
                    captainCoordsRef.current = { lat, lng }

                    // Update captain marker position without recreating map (Item 7)
                    if (captainMarkerRef.current) {
                        captainMarkerRef.current.setLngLat([lng, lat])
                    }

                    // Recalculate OSRM route periodically or after meaningful movement (Item 8)
                    checkAndRecalculateRoute(lng, lat)
                }
            }

            const handleRideStartedSocket = (startedRide) => {
                // console.log('[LiveRideMap] Received ride-started socket event:', startedRide)
                if (routeModeRef.current !== 'destination') {
                    switchToDestinationRoute()
                }
            }

            socket.on('driver-location', handleDriverLocation)
            socket.on('ride-started', handleRideStartedSocket)

            return () => {
                socket.off('driver-location', handleDriverLocation)
                socket.off('ride-started', handleRideStartedSocket)
                mapLoadedRef.current = false
                if (mapRef.current) {
                    mapRef.current.remove()
                    mapRef.current = null
                }
            }
        }

        return () => {
            mapLoadedRef.current = false
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [rideId, socket, drawRoute, switchToDestinationRoute, checkAndRecalculateRoute])

    return (
        <div className="w-full h-full relative">
            <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
        </div>
    )
}

export default LiveRideMap
