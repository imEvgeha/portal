import React from 'react';
import PropTypes from 'prop-types';
import {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import './NexusUserAvatar.scss';

const NexusUserAvatar = ({profileInfo, logout}) => {
    return (
        <DropdownItemGroup title={`${profileInfo.firstName} ${profileInfo.lastName}` || 'Profile'}>
            <DropdownItem onClick={logout}>Log out</DropdownItem>
        </DropdownItemGroup>
    );
};

NexusUserAvatar.propTypes = {
    profileInfo: PropTypes.object,
    logout: PropTypes.func,
};

NexusUserAvatar.defaultProps = {
    profileInfo: {},
    logout: () => null,
};

export default NexusUserAvatar;
