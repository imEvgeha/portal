import { AbilityBuilder, Ability } from '@casl/ability';
import {createCanBoundTo} from '@casl/react';
import {withRouter} from 'react-router-dom';
import React from 'react';

const ability = new Ability([]);

/**
 *  const DEFAULT_ALIASES = 'create', 'read', 'update', 'delete';
 * @param keycloak
 */

const updateAbility = (keycloak) => {
    const { can, rules, cannot } = AbilityBuilder.extract();

    // ******** Avail *************
    if (keycloak.hasRealmRole('avails_viewer')) {
        can('read', 'Avail');
    }
    if (keycloak.hasRealmRole('avails_user')) {
        can(['create', 'read', 'update', 'delete'], 'Avail');
    }
    if (keycloak.hasRealmRole('avails_admin')) {
        can(['create', 'read', 'update', 'delete'], 'Avail');
    }else{
        const edit_only_admin = ['createdAt'];
        cannot(['create', 'update', 'delete'], 'Avail', edit_only_admin);
    }

    // ******** Asset Management *************
    if (keycloak.hasRealmRole('asset_management_viewer')) {
        can('read', 'AssetManagement');
    }
    if (keycloak.hasRealmRole('asset_management_user')) {
        can(['create', 'read', 'update', 'delete'], 'AssetManagement');
    }
    if (keycloak.hasRealmRole('asset_management_admin')) {
        can(['create', 'read', 'update', 'delete'], 'AssetManagement');
    }

    // ******** Metadata *************
    // if (keycloak.hasRealmRole('metadata_viewer')) {
    //     can('read', 'Metadata');
    // } else if (keycloak.hasRealmRole('metadata_user')) {
    //     can(['create', 'read', 'update', 'delete'], 'Metadata');
    // } else if (keycloak.hasRealmRole('metadata_admin')) {
    //     can(['create', 'read', 'update', 'delete'], 'Metadata');
    // }

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
            return can(action, subject, field) ? <Component {...this.props}/> : <div>Invalid application state</div>;
        }

    }

    return withRouter(AuthenticatedComponent);
};


export {ability, updateAbility, Can, can, cannot, canRender};
