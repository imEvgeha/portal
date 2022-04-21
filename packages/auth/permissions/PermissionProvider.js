import React from 'react';
import PropTypes from 'prop-types';
import isAllowed, {setRoles} from './CheckPermissions';
import PermissionContext from './PermissionContext';

const PermissionProvider = ({roles, children}) => {
    setRoles(roles);

    const isAllowedTo = role => isAllowed(role);

    return <PermissionContext.Provider value={{isAllowedTo}}>{children}</PermissionContext.Provider>;
};

PermissionProvider.propTypes = {
    roles: PropTypes.array,
};

PermissionProvider.defaultProps = {
    roles: [],
};

export default PermissionProvider;
