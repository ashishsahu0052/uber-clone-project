import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
        <div className="bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1619059558110-c45be64b73ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRyYWZmaWMlMjBsaWdodHN8ZW58MHx8MHx8fDA%3D')] h-screen flex flex-col i justify-between">
            <img className="w-18 ml-3 mt-5" src="https://icon2.cleanpng.com/lnd/20241123/fe/01a0c7a4bc31fd14d50f86a45d55c0.webp" alt="Background" />
            <div className="bg-white  py-6 px-7 w-screen rounded-t-3xl">
                <h3 className="text-xl font-bold mb-4">get started with uber</h3>
                <Link to="/login" className="p-4 bg-black text-white text-xl rounded-lg inline-block w-full">Continue to login </Link>
            </div>
        </div>

        
    </div>
  )
}

export default Start