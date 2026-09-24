import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/userContext'
import { SocketContext } from '../context/SocketContext'
import axios from 'axios'

const UserProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserDataContext)
    const { socket } = useContext(SocketContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data.user)
                setIsLoading(false)
            }
        }).catch(err => {
            console.error("Error fetching user profile:", err)
            localStorage.removeItem('token')
            navigate('/login')
        })
    }, [token, navigate, setUser])

    useEffect(() => {
        if (user && user._id && socket) {
            socket.emit('join', { userType: 'user', userId: user._id })
        }
    }, [user, socket])

    if (!token) {
        return null
    }

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center font-medium text-lg">
                Loading...
            </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper