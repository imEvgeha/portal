import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import Unauthorized from '@vubiquity-nexus/portal-ui/lib/elements/nexus-error-boundary/Unauthorized';
import PermissionContext from './PermissionContext';

const Restricted = ({roles, children}) => {
    const {isAllowedTo} = useContext(PermissionContext);

    if (isAllowedTo(roles)) {
        return <>{children}</>;
    }
    return <Unauthorized />;
};

Restricted.propTypes = {
    roles: PropTypes.array,
};

Restricted.defaultProps = {
    roles: undefined,
};

export default Restricted;
