export const DOP_TASKS_HEDER = 'DOP Tasks';
export const DOP_QUEUED_TASKS_LABEL = 'Queued Tasks';
export const MY_SAVED_VIEWS_LABEL = 'My Saved Views';
export const MY_PREDEFINED_VIEWS_LABEL = 'Predefined Views';
export const SAVED_TABLE_DROPDOWN_LABEL = 'Saved Table View:';
export const USER = 'user';
export const POTENTIAL_OWNERS = 'potentialOwners';
export const ACTUAL_OWNER = 'actualOwner';
export const ALL = '*';
export const DOP_GUIDED_TASK_URL = '/AmdocsOSS/Portal/index.html?launchApp=Tasks&taskId=';
export const DOP_PROJECT_URL = '/AmdocsOSS/Portal/index.html?launchApp=Projects&projectId=';
export const PAGE_LIMIT = 100;

export const QUEUED_TASKS_OPTIONS = [
    {label: 'My Tasks', value: 'user'},
    {label: 'Queued Tasks', value: '*'},
];

export const SAVED_TABLE_SELECT_OPTIONS = [
    {label: 'All', value: 'all'},
    {label: 'Open', value: 'open'},
    {label: 'Not Started', value: 'notStarted'},
    {label: 'In Progress', value: 'inProgress'},
    {label: 'Closed', value: 'closed'},
];

export const TASK_STATUS_ENUM = ['READY', 'IN PROGRESS', 'COMPLETED', 'EXITED', 'OBSOLETE'];

export const PROJECT_STATUS_ENUM = {
    'BNOT STARTED': 'NOT STARTED',
    'CIN PROGRESS': 'IN PROGRESS',
    'CDRELEASE IN PROGRESS': 'RELEASE IN PROGRESS',
    DCOMPLETED: 'COMPLETED',
    'ECANCEL IN PROGRESS': 'CANCEL IN PROGRESS',
    FCANCELLED: 'CANCELLED',
    'AHHOLD IN PROGRESS': 'HOLD IN PROGRESS',
    'AIN ERROR': 'IN ERROR',
};

export const COLUMN_MAPPINGS = [
    {
        colId: 'taskName',
        field: 'taskName',
        headerName: 'Task Name',
        javaVariableName: 'taskName',
        enableSearch: true,
        searchDataType: 'string',
        cellRenderer: 'loadingCellRenderer',
        minWidth: 200,
    },
    {
        colId: 'taskStatus',
        field: 'taskStatus',
        javaVariableName: 'taskStatus',
        headerName: 'Status',
        enableSearch: true,
        searchDataType: 'multiselect',
        options: TASK_STATUS_ENUM,
        width: 180,
    },
    {
        colId: 'activityEstimatedEndDate',
        field: 'activityEstimatedEndDate',
        javaVariableName: 'activityEstimatedEndDate',
        headerName: 'Due Date',
        dataType: 'regionalMidnight',
        searchDataType: 'businessDateTime',
        width: 120,
    },
    {
        colId: 'projectName',
        field: 'projectName',
        javaVariableName: 'projectName',
        enableSearch: true,
        searchDataType: 'string',
        cellRenderer: 'loadingCellRenderer',
        headerName: 'Project Name',
        minWidth: 200,
    },
    {
        colId: 'OrderExternalID',
        field: 'OrderExternalID',
        javaVariableName: 'OrderExternalID',
        enableSearch: true,
        searchDataType: 'string',
        headerName: 'External Order ID',
        width: 150,
    },
    {
        colId: 'Customer',
        field: 'Customer',
        javaVariableName: 'Customer',
        headerName: 'Customer Name',
        enableSearch: true,
        searchDataType: 'string',
        width: 180,
    },
    {
        colId: 'servicingRegion',
        field: 'servicingRegion',
        javaVariableName: 'servicingRegion',
        headerName: 'Servicing Region',
        enableSearch: true,
        searchDataType: 'string',
        width: 120,
    },
    {
        colId: 'potentialOwners',
        field: 'potentialOwners',
        javaVariableName: 'potentialOwners',
        headerName: 'Work Queue',
        enableSearch: true,
        searchDataType: 'string',
        width: 120,
    },
    {
        colId: 'actualOwner',
        field: 'actualOwner',
        javaVariableName: 'actualOwner',
        headerName: 'Owner',
        enableSearch: true,
        searchDataType: 'string',
        width: 120,
    },
    {
        colId: 'activityActualStartDate',
        field: 'activityActualStartDate',
        javaVariableName: 'activityActualStartDate',
        headerName: 'Actual Start Date',
        dataType: 'regionalMidnight',
        searchDataType: 'businessDateTime',
        width: 120,
        hide: true,
    },
    {
        colId: 'activityActualEndDate',
        field: 'activityActualEndDate',
        javaVariableName: 'activityActualEndDate',
        headerName: 'Actual Completion Date',
        dataType: 'regionalMidnight',
        searchDataType: 'businessDateTime',
        width: 120,
        hide: true,
    },
    {
        colId: 'activityPlannedCompletionDate',
        field: 'activityPlannedCompletionDate',
        javaVariableName: 'activityPlannedCompletionDate',
        headerName: 'Planned Due Date',
        dataType: 'regionalMidnight',
        searchDataType: 'businessDateTime',
        width: 120,
        hide: true,
    },
    {
        colId: 'projectStartDate',
        field: 'projectStartDate',
        javaVariableName: 'projectStartDate',
        headerName: 'Project Start Date',
        dataType: 'regionalMidnight',
        searchDataType: 'businessDateTime',
        width: 120,
        hide: true,
    },
    {
        colId: 'projectPlannedCompletionDate',
        field: 'projectPlannedCompletionDate',
        javaVariableName: 'projectPlannedCompletionDate',
        headerName: 'Project Planned Due Date',
        dataType: 'regionalMidnight',
        searchDataType: 'businessDateTime',
        width: 120,
        hide: true,
    },
    {
        colId: 'projectStatus',
        field: 'projectStatus',
        javaVariableName: 'projectStatus',
        headerName: 'Project Status',
        width: 120,
        enableSearch: true,
        searchDataType: 'multiselect',
        options: Object.values(PROJECT_STATUS_ENUM),
        hide: true,
    },
];

export const INITIAL_SEARCH_PARAMS = {
    filterCriterion: [
        {
            fieldName: 'taskStatus',
            valueDataType: 'String',
            operator: 'in',
            logicalAnd: true,
            value: TASK_STATUS_ENUM.join(','),
        },
    ],
    sortCriterion: [
        {
            fieldName: 'activityEstimatedEndDate',
            ascending: true,
        },
    ],
};

export const STRING_FIELDS = [
    'taskName',
    'projectName',
    'OrderExternalID',
    'Customer',
    'servicingRegion',
    'potentialOwners',
];
export const DATE_FIELDS = [
    'activityEstimatedEndDate',
    'activityActualStartDate',
    'activityActualEndDate',
    'activityPlannedCompletionDate',
    'projectStartDate',
    'projectPlannedCompletionDate',
];
