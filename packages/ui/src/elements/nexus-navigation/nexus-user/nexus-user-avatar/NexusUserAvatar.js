import React from 'react';
import PropTypes from 'prop-types';
import {logout} from '@portal/portal-auth/authActions';
import LogoutIcon from '@vubiquity-nexus/portal-assets/logout.svg';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {Button} from 'primereact/button';
import {Divider} from 'primereact/divider';
import {connect} from 'react-redux';
import NexusTenantSelection from '../nexus-tenant-selection/NexusTenantSelection';

import './NexusUserAvatar.scss';

/**
 *
 * @param {profileInfo} profileInfo Redux - auth.profileInfo
 * @param {logout} logout Dispatch function to logout the user from session
 * @param {showTenantSelectionDropdown} showTenantSelectionDropdown Boolean - whether to show tenant list
 * @returns NexusUserAvatar
 */
const NexusUserAvatar = ({profileInfo, logout, showTenantSelectionDropdown}) => {
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
                <Button className="p-button-plain logout" aria-label="LogOut" onClick={logout}>
                    <LogoutIcon className="logoutIcon" />
                    <span className="logoutButtonText">Log Out</span>
                </Button>
            </div>
        );
    };

    return (
        <div className="NexusUserAvatar">
            <RenderAvatarHeading />
            {showTenantSelectionDropdown && <Divider className="NexusUserDivider" />}
            {showTenantSelectionDropdown && <RenderTenantDropdown />}
            <Divider className="NexusUserDivider" />
            <RenderAvatarActions />
        </div>
    );
};

NexusUserAvatar.propTypes = {
    profileInfo: PropTypes.object,
    logout: PropTypes.func,
    showTenantSelectionDropdown: PropTypes.bool,
};

NexusUserAvatar.defaultProps = {
    profileInfo: {},
    logout: () => null,
    showTenantSelectionDropdown: true,
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
