import React, {useEffect} from 'react';
import {Ability, AbilityBuilder} from '@casl/ability';
import {createCanBoundTo} from '@casl/react';
import {useNavigate, useParams} from 'react-router-dom';
import {AVAILS, DOP_TASKS, EVENT_MANAGEMENT, METADATA, SERVICING_ORDERS} from './constants';

const idToAbilityNameMap = {
    [AVAILS]: 'Avail',
    [METADATA]: 'Metadata',
    [SERVICING_ORDERS]: 'ServicingOrders',
    [EVENT_MANAGEMENT]: 'EventManagement',
    [DOP_TASKS]: 'DopTasks',
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
        can(['read', 'update'], 'ConfigUI');
    }
    if (roles && roles.includes('configuration_user')) {
        can(['create', 'read', 'update'], 'ConfigUI');
    }
    if (roles && roles.includes('configuration_admin')) {
        can(['create', 'read', 'update', 'delete'], 'ConfigUI');
    }

    // ******** Metadata *************
    if (roles.includes('metadata_admin')) {
        can(['create', 'read', 'update', 'delete'], 'Metadata');
    } else if (roles.includes('metadata_user')) {
        can(['create', 'read', 'update'], 'Metadata');
    } else if (roles.includes('metadata_viewer')) {
        can('read', 'Metadata');
    } else {
        cannot(['create', 'update', 'delete'], 'Metadata');
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

    // ******** DOP Tasks *************
    if (roles && roles.includes('dop_viewer')) {
        can(['create', 'read', 'update', 'delete'], 'DopTasks');
    }

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
    return props => {
        const navigate = useNavigate();
        const routeParams = useParams();

        useEffect(() => {
            if (cannot(action, subject, field)) {
                navigate(`${routeParams.realm}/401`);
            }
        }, []);

        return can(action, subject, field) ? <Component {...props} /> : <div>Invalid application state</div>;
    };
};

export {ability, updateAbility, Can, can, cannot, canRender, idToAbilityNameMap};
