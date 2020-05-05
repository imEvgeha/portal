import { AbilityBuilder, Ability } from '@casl/ability';
import {createCanBoundTo} from '@casl/react';
import {withRouter} from 'react-router-dom';
import React from 'react';
import {AVAILS, MEDIA, METADATA, SERVICING_ORDERS} from './ui/elements/nexus-navigation/constants';

const idToAbilityNameMap = {
    [AVAILS]: 'Avail',
    [METADATA]: 'Metadata',
    [MEDIA]: 'AssetManagement',
    [SERVICING_ORDERS]: 'ServicingOrders',
};

const ability = new Ability([]);

/**
 *  const DEFAULT_ALIASES = 'create', 'read', 'update', 'delete';
 * @param keycloak
 */

const updateAbility = (roles = []) => {
    const { can, rules, cannot } = AbilityBuilder.extract();

    // ******** Avail *************
    const edit_only_admin = ['createdAt', 'updatedAt', 'originallyReceivedAt', 'lastUpdateReceivedAt'];
    if (roles && roles.includes('avails_viewer')) {
        can('read', 'Avail');
    }
    if (roles && roles.includes('avails_user')) {
        can(['create', 'read', 'update', 'delete'], 'Avail');
    }
    if (roles && roles.includes('avails_admin')) {
        can(['create', 'read', 'update', 'delete'], 'Avail');
        cannot('create', 'Avail', edit_only_admin);
    }else{
        cannot(['create', 'update', 'delete'], 'Avail', edit_only_admin);
    }

    // ******** Asset Management *************
    if (roles && roles.includes('asset_management_viewer')) {
        can('read', 'AssetManagement');
    }
    if (roles && roles.includes('asset_management_user')) {
        can(['create', 'read', 'update', 'delete'], 'AssetManagement');
    }
    if (roles && roles.includes('asset_management_admin')) {
        can(['create', 'read', 'update', 'delete'], 'AssetManagement');
    }

    // ******** Config UI  *************
    if (roles && roles.includes('configuration_viewer')) {
        can('read', 'ConfigUI');
    }
    if (roles && roles.includes('configuration_user')) {        
        can(['create', 'read', 'update'], 'ConfigUI');
    }
    if (roles && roles.includes('configuration_admin')) {        
        can(['create', 'read', 'update', 'delete'], 'ConfigUI');
    }

    // ******** Metadata *************
    // if (roles.includes('metadata_viewer')) {
    //     can('read', 'Metadata');
    // } else if (roles.includes('metadata_user')) {
    //     can(['create', 'read', 'update', 'delete'], 'Metadata');
    // } else if (roles.includes('metadata_admin')) {
    can(['create', 'read', 'update', 'delete'], 'Metadata');
    // }


    // ******** Servicing Orders *************
    can(['create', 'read', 'update', 'delete'], 'ServicingOrders');

    ability.update(rules);
};

const Can = createCanBoundTo(ability);

const can = (action, subject, field = undefined) => {
    return ability.can(action, subject, field);
};

const cannot = (action, subject, field = undefined) => {
    return ability.cannot(action, subject, field);
};

const canRender = (Component, action, subject, field = undefined) => {

    class AuthenticatedComponent extends React.Component {

        componentDidMount() {
            if (cannot(action, subject, field)) {
                this.props.history.push('/');
            }
        }

        render() {
            return can(action, subject, field) ? <Component {...this.props} /> : <div>Invalid application state</div>;
        }

    }

    return withRouter(AuthenticatedComponent);
};


export {ability, updateAbility, Can, can, cannot, canRender, idToAbilityNameMap};
