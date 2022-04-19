import React from 'react';
import PropTypes from 'prop-types';
import isAllowed from './CheckPermissions';
import PermissionContext from './PermissionContext';

const PermissionProvider = ({permissions, children}) => {
    const isAllowedTo = permission => isAllowed(permissions, permission);

    return <PermissionContext.Provider value={{isAllowedTo}}>{children}</PermissionContext.Provider>;
};

PermissionProvider.propTypes = {
    permissions: PropTypes.array,
};

PermissionProvider.defaultProps = {
    permissions: [],
};

export default PermissionProvider;
