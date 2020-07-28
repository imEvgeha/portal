export const SELECTED_FOR_PLANNING_TAB = 'Selected for Planning';
export const PAGE_SIZE = 100;
export const getSearchPayload = (user, offset, limit) => ({
    filterCriterion: [
        {
            fieldName: 'MANAGER',
            valueDataType: 'String',
            operator: 'in',
            logicalAnd: true,
            value: user
        },
        {
            fieldName: 'STATUS',
            valueDataType: 'String',
            operator: 'in',
            'logicalAnd': true,
            'value': 'CIN PROGRESS'
        },
        {
            fieldName: 'TYPE',
            valueDataType: 'String',
            operator: 'in',
            logicalAnd: true,
            value: 'Rights_Planning'
        }
    ],
    sortCriterion: [
        {
            fieldName: 'ID',
            ascending: true
        }
    ],
    field: ['!projectAttribute'],
    offset,
    limit
});