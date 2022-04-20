import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import Unauthorized from '@vubiquity-nexus/portal-ui/lib/elements/nexus-error-boundary/Unauthorized';
import PermissionContext from './PermissionContext';

const RestrictedRoute = ({roles, children}) => {
    const {isAllowedTo} = useContext(PermissionContext);

    if (isAllowedTo(roles)) {
        return <>{children}</>;
    }
    return <Unauthorized />;
};

RestrictedRoute.propTypes = {
    roles: PropTypes.array,
};

RestrictedRoute.defaultProps = {
    roles: undefined,
};

export default RestrictedRoute;
