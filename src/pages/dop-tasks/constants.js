export const DOP_TASKS_HEDER = 'DOP Tasks';
export const DOP_QUEUED_TASKS_LABEL = 'Queued Tasks';
export const MY_SAVED_VIEWS_LABEL = 'My Saved Views';
export const MY_PREDEFINED_VIEWS_LABEL = 'Predefined Views';
export const SAVED_TABLE_DROPDOWN_LABEL = 'Saved Table View:';

export const QUEUED_TASKS_OPTIONS = [
    {label: 'My Tasks', value: 'myTasks'},
    {label: 'Queued Tasks', value: 'queuedTasks'},
];

export const SAVED_TABLE_SELECT_OPTIONS = [
    {label: 'Open', value: 'open'},
    {label: 'All', value: 'all'},
    {label: 'With Errors', value: 'withErrors'},
    {label: 'On Hold', value: 'onHold'},
    {label: 'Changed in last 24 hours', value: 'changedInLast24Hours'},
    {label: 'Changed in last 5 days', value: 'changedInLast5Days'},
];

export const getSearchPayload = (user, offset, limit) => ({
    filterCriterion: [
        {
            fieldName: 'MANAGER',
            valueDataType: 'String',
            operator: 'in',
            logicalAnd: true,
            value: user,
        },
        {
            fieldName: 'STATUS',
            valueDataType: 'String',
            operator: 'in',
            logicalAnd: true,
            value: '',
        },
        {
            fieldName: 'TYPE',
            valueDataType: 'String',
            operator: 'in',
            logicalAnd: true,
            value: '',
        },
    ],
    sortCriterion: [
        {
            fieldName: 'ID',
            ascending: true,
        },
    ],
    field: ['!projectAttribute'],
    offset,
    limit,
});

export const COLUMN_MAPPINGS = [
    {
        colId: 'taskName',
        field: 'taskName',
        headerName: 'Task Name',
        width: 150,
    },
    {
        colId: 'taskStatus',
        field: 'taskStatus',
        headerName: 'Status',
        width: 180,
    },
    {
        colId: 'activityEstimatedEndDate',
        field: 'activityEstimatedEndDate',
        headerName: 'Due Date',
        width: 180,
    },
    {
        colId: 'projectName',
        field: 'projectName',
        headerName: 'Project Name',
        width: 150,
    },
    {
        colId: 'OrderExternalID',
        field: 'OrderExternalID',
        headerName: 'External Order ID',
        width: 150,
    },
    {
        colId: 'Customer',
        field: 'Customer',
        headerName: 'Customer Name',
        width: 180,
    },
    {
        colId: 'servicingRegion',
        field: 'servicingRegion',
        headerName: 'Servicing Region',
        width: 120,
    },
    {
        colId: 'potentialOwners',
        field: 'potentialOwners',
        headerName: 'Work Queue',
        width: 120,
    },
    {
        colId: 'actualOwner',
        field: 'actualOwner',
        headerName: 'Owner',
        width: 120,
    },
    {
        colId: 'activityActualStartDate',
        field: 'activityActualStartDate',
        headerName: 'Actual Start Date',
        width: 120,
    },
    {
        colId: 'activityActualEndDate',
        field: 'activityActualEndDate',
        headerName: 'Actual Completion Date',
        width: 120,
    },
    {
        colId: 'activityPlannedCompletionDate',
        field: 'activityPlannedCompletionDate',
        headerName: 'Planned Due Date',
        width: 120,
    },
    {
        colId: 'projectStartDate',
        field: 'projectStartDate',
        headerName: 'Project Start Date',
        width: 120,
    },
    {
        colId: 'projectPlannedCompletionDate',
        field: 'projectPlannedCompletionDate',
        headerName: 'Project Planned Due Date',
        width: 120,
    },
    {
        colId: 'projectStatus',
        field: 'projectStatus',
        headerName: 'Project Status',
        width: 120,
    },
];
