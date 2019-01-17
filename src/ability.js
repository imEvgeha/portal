import { AbilityBuilder, Ability } from '@casl/ability';
import {createCanBoundTo} from '@casl/react';

const ability = new Ability([]);

/**
 *  const DEFAULT_ALIASES = 'create', 'read', 'update', 'delete';
 * @param keycloak
 */

const updateAbility = (keycloak) => {
    const { can, rules } = AbilityBuilder.extract();

    if (keycloak.hasRealmRole('catalog_viewer')) {
        can('read', 'Avail');
    } else if (keycloak.hasRealmRole('catalog_user')) {
        can(['create', 'read', 'update', 'delete'], 'Avail');
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


export {ability, updateAbility, Can, can, cannot};
