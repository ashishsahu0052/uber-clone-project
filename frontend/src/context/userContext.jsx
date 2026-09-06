import React from 'react'

export const UserDataContext = React.createContext()

const userContext = ({children}) => {
  return (
    <div>
      <UserDataContext.Provider>
        {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default userContext