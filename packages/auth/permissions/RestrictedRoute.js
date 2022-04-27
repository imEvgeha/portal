import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import PermissionContext from './PermissionContext';

const RestrictedRoute = ({roles, children}) => {
    const {isAllowedTo, unauthorizedAction} = useContext(PermissionContext);

    if (isAllowedTo(roles)) {
        return <>{children}</>;
    }

    unauthorizedAction();
    return null;
};

RestrictedRoute.propTypes = {
    roles: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

RestrictedRoute.defaultProps = {
    roles: undefined,
};

export default RestrictedRoute;
