import { AbilityBuilder, Ability } from '@casl/ability';
import {createCanBoundTo} from '@casl/react';

const ability = new Ability([]);

/**
 *  const DEFAULT_ALIASES = 'create', 'read', 'update', 'delete';
 * @param keycloak
 */

const updateAbility = (keycloak) => {
    const { can, rules } = AbilityBuilder.extract();

    // ******** Ability *************
    if (keycloak.hasRealmRole('avails_viewer')) {
        can('read', 'Avail');
    } else if (keycloak.hasRealmRole('avails_user')) {
        can(['create', 'read', 'update', 'delete'], 'Avail');
    } else if (keycloak.hasRealmRole('avails_admin')) {
        can(['create', 'read', 'update', 'delete'], 'Avail');
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


export {ability, updateAbility, Can, can, cannot};
