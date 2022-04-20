// eslint-disable-next-line no-underscore-dangle
let _allRoles = [];

export const setRoles = roles => {
    _allRoles = [...roles];
};

const isAllowed = roles => {
    return roles ? (typeof roles === 'string' ? _allRoles.includes(roles) : constructRoles(roles)) : true;
};

const constructRoles = roles => {
    let iterationPerm = roles.operation === 'AND';
    roles.values.forEach(value => {
        const tmpCondition = typeof value === 'string' ? _allRoles.includes(value) : constructRoles(value);
        roles.operation === 'AND' ? (iterationPerm &&= tmpCondition) : (iterationPerm ||= tmpCondition);
    });

    return iterationPerm;
};

export default isAllowed;

// export interface ComplexPermissions {
//     operation: 'AND' | 'OR'
//     values: Array<string | ComplexPermissions>
// }
