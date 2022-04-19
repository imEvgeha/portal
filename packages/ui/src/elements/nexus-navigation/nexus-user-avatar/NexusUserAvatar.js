import React, {useState} from 'react';
import PropTypes from 'prop-types';
import LogoutIcon from '@vubiquity-nexus/portal-assets/logout.svg';
import TenantIcon from '@vubiquity-nexus/portal-assets/tenant.svg';
import {logout} from '@vubiquity-nexus/portal-auth/authActions';
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

    const tenants = [
        {name: 'WB', code: 'WB'},
        {name: 'MGM', code: 'MGM'},
        {name: 'Vubiquity', code: 'VU'},
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
                <div className="country-item country-item-value">
                    <img
                        alt={option.name}
                        src={TenantIcon}
                        onError={e =>
                            (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')
                        }
                        className={`flag flag-${option.code.toLowerCase()}`}
                    />
                    <div>{option.name}</div>
                </div>
            );
        }

        // return <span>{props.placeholder}</span>;
    };

    const tenantOptionTemplate = option => {
        return (
            <div className="country-item">
                <img
                    alt={option.name}
                    src={TenantIcon}
                    onError={e =>
                        (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')
                    }
                    className={`flag flag-${option.code.toLowerCase()}`}
                />
                <div>{option.name}</div>
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
                    optionLabel="name"
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
