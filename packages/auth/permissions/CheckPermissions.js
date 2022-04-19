import {cloneDeep} from 'lodash/lang';

// eslint-disable-next-line no-underscore-dangle
let _allPermissions = {};

const isAllowed = (allPermissions, permissions) => {
    _allPermissions = cloneDeep(allPermissions);

    return permissions
        ? typeof permissions === 'string'
            ? _allPermissions.includes(permissions)
            : constructPermissions(permissions)
        : true;
};

const constructPermissions = permissions => {
    let iterationPerm = permissions.operation === 'AND';
    permissions.values.forEach(value => {
        const tmpCondition = typeof value === 'string' ? _allPermissions.includes(value) : constructPermissions(value);
        permissions.operation === 'AND' ? (iterationPerm &&= tmpCondition) : (iterationPerm ||= tmpCondition);
    });

    return iterationPerm;
};

export default isAllowed;

// export interface ComplexPermissions {
//     operation: 'AND' | 'OR'
//     values: Array<string | ComplexPermissions>
// }
