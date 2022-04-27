import React from 'react';
import PropTypes from 'prop-types';
import isAllowed, {setRoles} from './CheckPermissions';
import PermissionContext from './PermissionContext';

const PermissionProvider = ({roles, children, unauthorizedAction}) => {
    setRoles(roles);

    const isAllowedTo = role => isAllowed(role);

    return (
        <PermissionContext.Provider value={{isAllowedTo, unauthorizedAction}}>{children}</PermissionContext.Provider>
    );
};

PermissionProvider.propTypes = {
    roles: PropTypes.array,
    unauthorizedAction: PropTypes.func,
};

PermissionProvider.defaultProps = {
    roles: [],
    unauthorizedAction: () => <div>Unauthorized</div>,
};

export default PermissionProvider;
