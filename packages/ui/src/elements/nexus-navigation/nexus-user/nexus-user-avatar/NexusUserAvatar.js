import React from 'react';
import PropTypes from 'prop-types';
import LogoutIcon from '@vubiquity-nexus/portal-assets/logout.svg';
import {logout} from '@vubiquity-nexus/portal-auth/authActions';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {Button} from 'primereact/button';
import {Divider} from 'primereact/divider';
import {connect} from 'react-redux';
import NexusTenantSelection from '../nexus-tenant-selection/NexusTenantSelection';

import './NexusUserAvatar.scss';

/**
 *
 * @param {profileInfo} Retrieves User profile from Redux
 * @param {logout} Dispatch function to logout the user from session
 * @returns NexusUserAvatar
 */
const NexusUserAvatar = ({profileInfo, logout}) => {
    /**
     *
     * @returns Render Header of Avatar
     */
    const RenderAvatarHeading = () => {
        return (
            <div className="UserAvatarHeading">
                <div className="UserAvatarFullName">
                    {`${profileInfo.firstName} ${profileInfo.lastName}` || 'Profile'}
                </div>
                <div className="UserAvatarUsername">{`${profileInfo.username}`}</div>
                <div className="ApplicationVersion">{`v${getConfig('portalVersion')}`}</div>
            </div>
        );
    };

    /**
     *
     * @returns Tenant Dropdown for tenant selection
     */
    const RenderTenantDropdown = () => {
        return <NexusTenantSelection />;
    };

    /**
     *
     * @returns Avatar Actions - Bottom section for actions
     */
    const RenderAvatarActions = () => {
        return (
            <div className="UserAvatarLogout">
                <Button className="logout p-0" aria-label="LogOut" onClick={logout}>
                    <LogoutIcon className="logoutIcon" />
                    <span className="px-3">Log Out</span>
                </Button>
            </div>
        );
    };

    return (
        <div className="NexusUserAvatar">
            <RenderAvatarHeading />
            <Divider />
            <RenderTenantDropdown />
            <Divider />
            <RenderAvatarActions />
        </div>
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

const mapStateToProps = ({auth}) => {
    const {userAccount} = auth || {};
    return {
        profileInfo: userAccount,
    };
};

const mapDispatchToProps = dispatch => ({
    logout: payload => dispatch(logout(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NexusUserAvatar);
