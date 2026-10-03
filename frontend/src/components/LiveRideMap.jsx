import React, { useEffect, useRef, useContext } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import axios from 'axios'
import { SocketContext } from '../context/SocketContext'

const LiveRideMap = ({ ride, userType = 'user', initialCaptainLocation = null }) => {
    const mapContainerRef = useRef(null)
    const mapRef = useRef(null)
    const captainMarkerRef = useRef(null)
    const pickupMarkerRef = useRef(null)
    const destMarkerRef = useRef(null)
    const routeCoordinatesRef = useRef(null)
    const { socket } = useContext(SocketContext)

    const rideId = ride?._id

    // Fallback default coordinates (Bhopal / center)
    const defaultCoords = { lat: 23.2599, lng: 77.4126 }

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

        // Helper to draw or update OSRM GeoJSON route on the map
        const drawRoute = async (startLngLat, endLngLat) => {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${startLngLat[0]},${startLngLat[1]};${endLngLat[0]},${endLngLat[1]}?overview=full&geometries=geojson`
                const response = await axios.get(url, { timeout: 5000 })

                if (response.data && response.data.code === 'Ok' && response.data.routes?.[0]) {
                    const routeGeoJSON = response.data.routes[0].geometry
                    routeCoordinatesRef.current = routeGeoJSON.coordinates

                    if (map.getSource('osrm-route')) {
                        map.getSource('osrm-route').setData({
                            type: 'Feature',
                            properties: {},
                            geometry: routeGeoJSON
                        })
                    } else {
                        map.addSource('osrm-route', {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: routeGeoJSON
                            }
                        })

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
                                'line-width': 5,
                                'line-opacity': 0.85
                            }
                        })
                    }

                    // Fit bounds to show route
                    const bounds = new maplibregl.LngLatBounds()
                    routeGeoJSON.coordinates.forEach(coord => bounds.extend(coord))
                    map.fitBounds(bounds, { padding: 90, maxZoom: 16 })
                }
            } catch (err) {
                console.warn('OSRM route fetch fallback:', err.message)
                // Fallback straight line if OSRM is busy
                const lineGeoJSON = {
                    type: 'LineString',
                    coordinates: [startLngLat, endLngLat]
                }
                if (map.getSource('osrm-route')) {
                    map.getSource('osrm-route').setData({
                        type: 'Feature',
                        properties: {},
                        geometry: lineGeoJSON
                    })
                } else {
                    map.addSource('osrm-route', {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: lineGeoJSON
                        }
                    })
                    map.addLayer({
                        id: 'osrm-route-layer',
                        type: 'line',
                        source: 'osrm-route',
                        paint: {
                            'line-color': '#000000',
                            'line-width': 4,
                            'line-dasharray': [2, 2]
                        }
                    })
                }
            }
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
                        headers: { Authorization: `Bearer ${token}` }
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
                        headers: { Authorization: `Bearer ${token}` }
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

            // Determine captain position (use passed, or ride.captain.location, or slight offset from pickup)
            const captainLat = initialCaptainLocation?.lat || ride?.captain?.location?.lat || (pickupCoords.lat - 0.012)
            const captainLng = initialCaptainLocation?.lng || ride?.captain?.location?.long || ride?.captain?.location?.lng || (pickupCoords.lng - 0.015)

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

            // Phase 1 Route: CAPTAIN -> RIDER/PICKUP
            await drawRoute([captainLng, captainLat], [pickupCoords.lng, pickupCoords.lat])
        }

        map.on('load', () => {
            setupMapData()
        })

        // 4. Socket room join & live captain location listener
        if (socket && rideId) {
            // Join specific ride room: ride:${rideId}
            socket.emit('join-ride', { rideId })

            const handleDriverLocation = (location) => {
                if (!location) return
                const lat = location.lat ?? location.latitude
                const lng = location.lng ?? location.longitude

                if (typeof lat === 'number' && typeof lng === 'number') {
                    // Move the captain marker using marker.setLngLat([lng, lat])
                    if (captainMarkerRef.current) {
                        captainMarkerRef.current.setLngLat([lng, lat])
                    }
                }
            }

            socket.on('driver-location', handleDriverLocation)

            return () => {
                socket.off('driver-location', handleDriverLocation)
                if (mapRef.current) {
                    mapRef.current.remove()
                    mapRef.current = null
                }
            }
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [rideId, socket])

    return (
        <div className="w-full h-full relative">
            <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
        </div>
    )
}

export default LiveRideMap
