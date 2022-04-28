import React from 'react';
import PropTypes from 'prop-types';
import TenantIcon from '@vubiquity-nexus/portal-assets/tenant.svg';
import {setSelectedTenantInfo} from '@vubiquity-nexus/portal-auth/authActions';
import {keycloak} from '@vubiquity-nexus/portal-auth/keycloak';
import {Dropdown} from 'primereact/dropdown';
import {connect, useDispatch} from 'react-redux';
import './NexusTenantSelection.scss';

/**
 * Based on token, show a list of available tenant
 * @returns Dispatches to Redux the selected tenant under auth.selectedTenant
 */
const NexusTenantSelection = ({selectedTenant}) => {
    // const [userSelectedTenant, setUserSelectedTenant] = useState(selectedTenant);
    const {resourceAccess} = keycloak;
    const dispatch = useDispatch();

    // TODO: useEffect on init
    const tenants = [
        ...Object.entries(resourceAccess)
            // keycloak returns 'account' client by default
            .filter(tenantClient => tenantClient[0] !== 'account')
            .map(client => {
                return {
                    id: client[0],
                    roles: [...client[1].roles],
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
        dispatch(setSelectedTenantInfo(e.value));
    };

    return (
        <div className="UserAvatarTenantsSelection p-field">
            <Dropdown
                value={selectedTenant}
                options={tenants}
                onChange={e => onTenantChange(e)}
                optionLabel="id"
                placeholder="Select Tenant"
                valueTemplate={selectedTenantTemplate}
                itemTemplate={tenantOptionTemplate}
                dropdownIcon="pi pi-chevron-right"
            />
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
