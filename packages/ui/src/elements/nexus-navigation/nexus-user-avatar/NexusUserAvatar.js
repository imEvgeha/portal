import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import LogoutIcon from '@vubiquity-nexus/portal-assets/logout.svg';
import TenantIcon from '@vubiquity-nexus/portal-assets/tenant.svg';
import {logout, setSelectedTenantInfo} from '@vubiquity-nexus/portal-auth/authActions';
import {keycloak} from '@vubiquity-nexus/portal-auth/keycloak';
import {Button} from 'primereact/button';
import {Divider} from 'primereact/divider';
import {Dropdown} from 'primereact/dropdown';
import {connect, useDispatch} from 'react-redux';

import './NexusUserAvatar.scss';

/**
 *
 * @param {profileInfo} Retrieves User profile from Redux
 * @param {logout} Dispatch function to logout the user from session
 * @returns NexusUserAvatar
 */
const NexusUserAvatar = ({profileInfo, logout, selectedTenant, packageJsonVersion}) => {
    const [userSelectedTenant, setUserSelectedTenant] = useState(selectedTenant);
    const {resourceAccess} = keycloak;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSelectedTenantInfo(userSelectedTenant));
    }, [userSelectedTenant]);

    // TODO: useEffect on init
    const tenants = [
        ...Object.entries(resourceAccess)
            // keycloak returns 'account' client by default
            .filter(tenantClient => tenantClient[0] !== 'account')
            .map(client => {
                return {
                    id: client[0],
                    permissions: [...client[1].roles],
                };
            }),
    ];

    /**
     *
     * @param {option} option Selected option from the dropdown
     * @param {props} props props of the dropdown
     * @returns
     */
    const selectedTenantTemplate = (option, props) => {
        if (option) {
            return (
                <div className="tenant-item">
                    <TenantIcon className="tenantIcon" />
                    <div className="tenantName">{option.id}</div>
                </div>
            );
        }

        // return <span>{props.placeholder}</span>;
    };

    const tenantOptionTemplate = option => {
        return (
            <div className="tenant-item">
                <div className="tenantName">{option.id}</div>
            </div>
        );
    };

    const onTenantChange = e => {
        setUserSelectedTenant(e.value);
    };

    return (
        <div className="NexusUserAvatar">
            <div className="UserAvatarHeading">
                <div className="UserAvatarFullName">
                    {`${profileInfo.firstName} ${profileInfo.lastName}` || 'Profile'}
                </div>
                <div className="UserAvatarUsername">{`${profileInfo.username}`}</div>
                <div className="ApplicationVersion">{`v${packageJsonVersion}`}</div>
            </div>
            <Divider />
            <div className="UserAvatarTenantsSelection">
                <Dropdown
                    value={userSelectedTenant}
                    options={tenants}
                    onChange={e => onTenantChange(e)}
                    optionLabel="id"
                    placeholder="Select Tenant"
                    valueTemplate={selectedTenantTemplate}
                    itemTemplate={tenantOptionTemplate}
                    dropdownIcon="pi pi-chevron-right"
                />
            </div>
            <Divider />
            <div className="UserAvatarLogout">
                <Button className="logout p-0" aria-label="LogOut" onClick={logout}>
                    <LogoutIcon className="logoutIcon" />
                    <span className="px-3">Log Out</span>
                </Button>
            </div>
        </div>
    );
};

NexusUserAvatar.propTypes = {
    profileInfo: PropTypes.object,
    logout: PropTypes.func,
    selectedTenant: PropTypes.object,
    packageJsonVersion: PropTypes.string,
};

NexusUserAvatar.defaultProps = {
    profileInfo: {},
    selectedTenant: {},
    logout: () => null,
    packageJsonVersion: '1.0.0',
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
