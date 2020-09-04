import React from 'react';
import PropTypes from 'prop-types';
import {AbilityBuilder, Ability} from '@casl/ability';
import {createCanBoundTo} from '@casl/react';
import {withRouter} from 'react-router-dom';
import {AVAILS, MEDIA, METADATA, SERVICING_ORDERS, EVENT_MANAGEMENT} from './ui/elements/nexus-navigation/constants';

const idToAbilityNameMap = {
    [AVAILS]: 'Avail',
    [METADATA]: 'Metadata',
    [MEDIA]: 'AssetManagement',
    [SERVICING_ORDERS]: 'ServicingOrders',
    [EVENT_MANAGEMENT]: 'EventManagement',
};

const ability = new Ability([]);

/**
 *  const DEFAULT_ALIASES = 'create', 'read', 'update', 'delete';
 * @param roles
 */

const updateAbility = (roles = []) => {
    const {can, rules, cannot} = AbilityBuilder.extract();

    // ******** Avail *************
    const editOnlyAdmin = ['lastUpdateReceivedAt', 'originallyReceivedAt'];
    if (roles && roles.includes('avails_viewer')) {
        can('read', 'Avail');
    }
    if (roles && roles.includes('avails_user')) {
        can(['create', 'read', 'update', 'delete'], 'Avail');
    }
    if (roles && roles.includes('avails_admin')) {
        can(['create', 'read', 'update', 'delete'], 'Avail');
        cannot('create', 'Avail', editOnlyAdmin);
    } else {
        cannot(['create', 'update', 'delete'], 'Avail', editOnlyAdmin);
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
    //TODO: metadata_user to be added in PORT 2651
    can(['create', 'read', 'update'], 'Metadata');

    if (roles.includes('metadata_viewer')) {
        can('read', 'Metadata');
    }
    else if (roles.includes('metadata_admin')) {
        can(['create', 'read', 'update', 'delete'], 'Metadata');
    }

    // ******** Servicing Orders *************
    can(['create', 'read', 'update', 'delete'], 'ServicingOrders');

    // ******** Event Management *************
    if (roles && roles.includes('event_viewer')) {
        can(['read'], 'EventManagement');
    }
    if (roles && roles.includes('event_admin')) {
        can(['create', 'update', 'delete'], 'EventManagement');
    }

    // ******** Sync Log *************
    can(['create', 'read', 'update', 'delete'], 'SyncLog');

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
                const {history} = this.props;
                history.push('/401');
            }
        }

        render() {
            return can(action, subject, field) ? <Component {...this.props} /> : <div>Invalid application state</div>;
        }
    }

    AuthenticatedComponent.propTypes = {
        history: PropTypes.object.isRequired,
    };

    return withRouter(AuthenticatedComponent);
};

export {ability, updateAbility, Can, can, cannot, canRender, idToAbilityNameMap};
