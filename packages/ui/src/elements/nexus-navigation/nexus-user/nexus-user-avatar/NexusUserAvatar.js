import React from 'react';
import PropTypes from 'prop-types';
import {keycloak} from '@portal/portal-auth';
import {logout, setSelectedTenantInfo} from '@portal/portal-auth/authActions';
import ExpandRightIcon from '@vubiquity-nexus/portal-assets/expand_right.svg';
import LogoutIcon from '@vubiquity-nexus/portal-assets/logout.svg';
import TenantIcon from '@vubiquity-nexus/portal-assets/tenant.svg';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {Divider} from 'primereact/divider';
import {TieredMenu} from 'primereact/tieredmenu';
import {connect, useDispatch, useSelector} from 'react-redux';

import './NexusUserAvatar.scss';

/**
 *
 * @param {Object} profileInfo Redux - auth.profileInfo
 * @param {logout} logout Dispatch function to logout the user from session
 * @param {Boolean} showTenantSelectionDropdown Whether to show tenant list
 * @returns NexusUserAvatar
 */
const NexusUserAvatar = ({selectedTenant, profileInfo, logout, showTenantSelectionDropdown, menu}) => {
    const dispatch = useDispatch();
    const currentLoggedInUsername = useSelector(state => state?.auth?.userAccount?.username);
    // get client roles from keycloak
    const {resourceAccess} = keycloak;
    // filter out clients that are not tenants
    const filteredResourceAccess = {...resourceAccess};
    delete filteredResourceAccess['account'];
    delete filteredResourceAccess['realm-management'];
    /**
     * Template used for the selected Tenant in TieredMenu
     * @param {*} item Client item
     * @param {*} options All options
     * @returns
     */
    const tenantSelectedTemplated = (item, options) => {
        return (
            <div className="tenant-selected-item" onClick={options.onClick}>
                <div className="tenantDescription">
                    <TenantIcon className="tenantIcon" />
                    <span className="tenantName">{item.label}</span>
                </div>
                <div className="actionIcon">
                    <ExpandRightIcon className="expandIcon" />
                </div>
            </div>
        );
    };

    /**
     * Template used for all the Tenant Options in TieredMenu
     * @param {*} option Client option
     * @param {*} index Index of the client
     * @returns
     */
    const tenantOptionTemplate = (option, index) => {
        return (
            <div className="tenant-option-item" onClick={e => onTenantChange(option)}>
                <div className="tenantName">{option[0]}</div>
                {renderDivider(index) && <Divider className="TenantSelectionDivider" />}
            </div>
        );
    };

    /**
     * This is used to calculate when to render a Divider after a tenant
     * If it is the last tenant, do not render a <Divider />
     * @param {*} index Index of the tenant
     * @returns
     */
    const renderDivider = index => {
        return index + 1 < Object.keys(filteredResourceAccess).length;
    };

    /**
     * onChange function when selecting a tenant from the Dropdown list
     * @param {*} selectedTenant
     */
    const onTenantChange = selectedTenant => {
        const tempSelectedTenant = {
            id: selectedTenant[0],
            roles: selectedTenant[1].roles,
        };
        dispatch(setSelectedTenantInfo(tempSelectedTenant));
        localStorage.setItem(
            'selectedTenant',
            JSON.stringify({
                ...JSON.parse(localStorage.getItem('selectedTenant')),
                [currentLoggedInUsername]: tempSelectedTenant,
            })
        );
    };

    /**
     * Contruct the dynamic tenants, based on the resourceAccess from keycloak
     */
    const tenants = () => {
        return {
            label: selectedTenant.id,
            template: tenantSelectedTemplated,
            roles: selectedTenant.roles,
            items: [
                ...Object.entries(filteredResourceAccess).map((client, index) => {
                    return {
                        id: client[0],
                        roles: [...client[1].roles],
                        template: tenantOptionTemplate(client, index),
                        label: client[0],
                    };
                }),
            ],
        };
    };

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
     * @returns Avatar Actions - Bottom section for actions
     */
    const RenderAvatarActions = () => {
        return (
            <div className="UserAvatarActions">
                <div className="tenant-logout-action" onClick={logout}>
                    <LogoutIcon className="logoutIcon" />
                    <span className="logoutButtonText">Log Out</span>
                </div>
            </div>
        );
    };

    /**
     * Contruct the items model as expected by TieredMenu
     * Reference: https://www.primefaces.org/primereact/tieredmenu/
     */
    const items = [
        {
            template: RenderAvatarHeading,
        },
        {
            separator: true,
        },
        tenants(),
        {
            separator: true,
        },
        {
            template: RenderAvatarActions,
        },
    ];

    return (
        <div className="NexusUserAvatar">
            <TieredMenu model={items} className="TenantSelection" popup ref={menu} />
        </div>
    );
};

NexusUserAvatar.propTypes = {
    selectedTenant: PropTypes.object,
    profileInfo: PropTypes.object,
    logout: PropTypes.func,
    showTenantSelectionDropdown: PropTypes.bool,
    menu: PropTypes.any,
};

NexusUserAvatar.defaultProps = {
    profileInfo: {},
    logout: () => null,
    showTenantSelectionDropdown: false,
    menu: null,
    selectedTenant: {},
};

const mapStateToProps = ({auth}) => {
    const {userAccount, selectedTenant} = auth || {};
    return {
        profileInfo: userAccount,
        selectedTenant,
    };
};

const mapDispatchToProps = dispatch => ({
    logout: payload => dispatch(logout(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NexusUserAvatar);
