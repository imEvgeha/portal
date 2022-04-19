import React from 'react'

const defaultBehaviour = {
    isAllowedTo: () => true
}

const PermissionContext = React.createContext(defaultBehaviour)

export default PermissionContext
