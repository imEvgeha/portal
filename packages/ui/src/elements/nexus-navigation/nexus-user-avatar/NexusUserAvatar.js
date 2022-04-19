import React, {useState} from 'react';
import PropTypes from 'prop-types';
import LogoutIcon from '@vubiquity-nexus/portal-assets/logout.svg';
import TenantIcon from '@vubiquity-nexus/portal-assets/tenant.svg';
import {logout} from '@vubiquity-nexus/portal-auth/authActions';
import {keycloak} from '@vubiquity-nexus/portal-auth/keycloak';
import {Button} from 'primereact/button';
import {Divider} from 'primereact/divider';
import {Dropdown} from 'primereact/dropdown';
import {connect} from 'react-redux';
import './NexusUserAvatar.scss';

/**
 *
 * @param {profileInfo} Retrieves User profile from Redux
 * @param {logout} Dispatch function to logout the user from session
 * @returns NexusUserAvatar
 */
const NexusUserAvatar = ({profileInfo, logout}) => {
    const [selectedTenant, setSelectedTenant] = useState(null);
    const {resourceAccess} = keycloak;

    // TODO: useEffect on init
    const tenants = [
        ...Object.entries(resourceAccess).map(client => {
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
                <div className="tenant-item tenant-item-value">
                    <i className={`${TenantIcon} px-2`} />
                    <div>{option.id}</div>
                </div>
            );
        }

        // return <span>{props.placeholder}</span>;
    };

    const tenantOptionTemplate = option => {
        return (
            <div className="tenant-item">
                <i className={`${TenantIcon} px-2`} />
                <div>{option.id}</div>
            </div>
        );
    };

    const onTenantChange = e => {
        setSelectedTenant(e.value);
    };

    return (
        <div className="NexusUserAvatar">
            <div className="UserAvatarHeading">
                <div className="UserAvatarFullName">
                    {`${profileInfo.firstName} ${profileInfo.lastName}` || 'Profile'}
                </div>
                <div className="UserAvatarUsername">{`${profileInfo.username}`}</div>
            </div>
            <Divider />
            <div className="UserAvatarTenantsSelection">
                <Dropdown
                    value={selectedTenant}
                    options={tenants}
                    onChange={e => onTenantChange(e.value)}
                    optionLabel="id"
                    placeholder="Select a Tenant"
                    valueTemplate={selectedTenantTemplate}
                    itemTemplate={tenantOptionTemplate}
                    dropdownIcon="pi pi-chevron-right"
                    showOnFocus
                />
            </div>
            <Divider />
            <div className="UserAvatarLogout">
                <Button className="logout p-0" aria-label="LogOut" onClick={logout}>
                    <i className={`${LogoutIcon} px-2`} />
                    <span className="px-3">Log Out</span>
                </Button>
            </div>
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
