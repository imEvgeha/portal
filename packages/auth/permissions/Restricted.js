import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import PermissionContext from './PermissionContext';

const Restricted = ({roles, children}) => {
    const {isAllowedTo} = useContext(PermissionContext);

    if (isAllowedTo(roles)) {
        return <>{children}</>;
    }
    return null;
};

Restricted.propTypes = {
    roles: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

Restricted.defaultProps = {
    roles: undefined,
};

export default Restricted;
