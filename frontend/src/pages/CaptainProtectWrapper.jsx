import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
const CaptainProtectWrapper = ({children}) => {
    const token = localStorage.getItem('token')
    const [isLoading, setIsLoadning] = React.useState(true)
    const {captain, setCaptain} = React.useContext(CaptainDataContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (!token) {
            navigate('/captain-login')
        }
    }, [token, navigate])

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            // Captain is authenticated, you can access the profile data here
            setCaptain(response.data)
            setIsLoadning(false)
        }
    }).catch((error) => {
        console.error('Error fetching captain profile:', error)
        localStorage.removeItem('token')
        navigate('/captain-login')
    })

    
  return (
    <div>{children}</div>
  )
}

export default CaptainProtectWrapper