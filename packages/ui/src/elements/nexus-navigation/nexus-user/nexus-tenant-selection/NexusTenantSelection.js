import React from 'react';
import PropTypes from 'prop-types';
import {keycloak} from '@portal/portal-auth';
import {setSelectedTenantInfo} from '@portal/portal-auth/authActions';
import ExpandRightIcon from '@vubiquity-nexus/portal-assets/expand_right.svg';
import TenantIcon from '@vubiquity-nexus/portal-assets/tenant.svg';
import {Divider} from 'primereact/divider';
import {TieredMenu} from 'primereact/tieredmenu';
import {connect, useDispatch} from 'react-redux';
import './NexusTenantSelection.scss';

/**
 * Based on token, show a list of available tenant
 * @returns Dispatches to Redux the selected tenant under auth.selectedTenant
 */
const NexusTenantSelection = ({selectedTenant}) => {
    const dispatch = useDispatch();
    // get client roles from keycloak
    let {resourceAccess} = keycloak;
    // filter out clients that are not tenants
    resourceAccess = {
        ...Object.entries(resourceAccess)
            // keycloak returns 'account' & 'realm-management' client by default
            .filter(tenantClient => tenantClient[0] !== 'account' && tenantClient[0] !== 'realm-management'),
    };

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
        return index + 1 < Object.keys(resourceAccess).length;
    };

    /**
     * onChange function when selecting a tenant from the Dropdown list
     * @param {*} selectedTenant
     */
    const onTenantChange = selectedTenant => {
        dispatch(
            setSelectedTenantInfo({
                id: selectedTenant[0],
                roles: selectedTenant[1].roles,
            })
        );
    };

    const tenants = [
        {
            label: selectedTenant.id,
            template: tenantSelectedTemplated,
            roles: selectedTenant.roles,
            items: [
                ...Object.entries(resourceAccess).map((client, index) => {
                    return {
                        id: client[1][0],
                        roles: [...client[1][1].roles],
                        template: tenantOptionTemplate(client[1], index),
                        label: client[1][0],
                    };
                }),
            ],
        },
    ];

    return (
        <div className="UserAvatarTenantsSelection p-field">
            <TieredMenu className="TenantSelection" model={tenants} appendTo="UserAvatarTenantsSelection" />
        </div>
    );
};

NexusTenantSelection.propTypes = {
    selectedTenant: PropTypes.object,
};

NexusTenantSelection.defaultProps = {
    selectedTenant: {},
};

const mapStateToProps = ({auth}) => {
    const {selectedTenant} = auth || {};
    return {
        selectedTenant,
    };
};

export default connect(mapStateToProps, {})(NexusTenantSelection);
