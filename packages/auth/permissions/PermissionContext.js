import React from 'react';

const defaultBehaviour = {
    isAllowedTo: () => true,
    unauthorizedAction: () => ({}),
};

const PermissionContext = React.createContext(defaultBehaviour);

export default PermissionContext;
