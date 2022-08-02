export const DOP_TASKS_HEDER = 'DOP Tasks';
export const DOP_QUEUED_TASKS_LABEL = 'Queued Tasks';
export const USER = 'user';
export const POTENTIAL_OWNERS = 'potentialOwners';
export const ACTUAL_OWNER = 'actualOwner';
export const ALL = '*';

export const QUEUED_TASKS_OPTIONS = [
    {label: 'My Tasks', value: 'user'},
    {label: 'Queued Tasks', value: '*'},
];

export const SAVED_TABLE_DROPDOWN_LABEL = 'Saved Table View:';
export const MY_SAVED_VIEWS_LABEL = 'My Saved Views';
export const MY_PREDEFINED_VIEWS_LABEL = 'Predefined Views';

export const SAVED_TABLE_SELECT_OPTIONS = [
    {label: 'All', value: 'all'},
    {label: 'Open', value: 'open'},
    {label: 'Not Started', value: 'notStarted'},
    {label: 'In Progress', value: 'inProgress'},
    {label: 'Closed', value: 'closed'},
];

export const TASK_STATUS_ENUM = {
    READY: 'READY',
    IN_PROGRESS: 'IN PROGRESS',
    COMPLETED: 'COMPLETED',
    EXITED: 'EXITED',
    OBSOLETE: 'OBSOLETE',
};

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
        options: Object.values(TASK_STATUS_ENUM),
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
        colId: 'customPriority',
        field: 'customPriority',
        javaVariableName: 'customPriority',
        enableSearch: true,
        headerName: 'Priority',
        minWidth: 80,
        searchDataType: 'multiselect',
        options: ['Low', 'Medium', 'High'],
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
    {
        colId: 'language',
        field: 'language',
        javaVariableName: 'language',
        headerName: 'Language',
        width: 100,
        enableSearch: true,
        searchDataType: 'multiselect',
        configEndpoint: '/languages',
        hide: true,
    },
    {
        colId: 'locale',
        field: 'locale',
        javaVariableName: 'locale',
        headerName: 'Locale',
        width: 100,
        enableSearch: true,
        searchDataType: 'multiselect',
        configEndpoint: '/countries',
        hide: true,
    },
    {
        colId: 'licenseStartDate',
        field: 'licenseStartDate',
        javaVariableName: 'licenseStartDate',
        headerName: 'License Start Date',
        width: 120,
        searchDataType: 'businessDateTime',
        dataType: 'regionalMidnight',
        hide: true,
    },
    {
        colId: 'affiliate',
        field: 'affiliate',
        javaVariableName: 'affiliate',
        headerName: 'Affiliates',
        width: 100,
        enableSearch: true,
        searchDataType: 'multiselect',
        configEndpoint: '/affiliates',
        hide: true,
    },
    {
        colId: 'territory',
        field: 'territory',
        javaVariableName: 'territory',
        headerName: 'Territories',
        width: 100,
        enableSearch: true,
        searchDataType: 'multiselect',
        configEndpoint: '/countries',
        hide: true,
    },
    {
        colId: 'contentType',
        field: 'contentType',
        javaVariableName: 'contentType',
        headerName: 'Content Type',
        width: 100,
        enableSearch: true,
        searchDataType: 'multiselect',
        configEndpoint: '/contentType',
        hide: true,
    },
    {
        colId: 'coreTitleID',
        field: 'coreTitleID',
        javaVariableName: 'coreTitleID',
        headerName: 'Title ID',
        width: 100,
        enableSearch: true,
        searchDataType: 'string',
        hide: true,
    },
    {
        colId: 'title',
        field: 'title',
        javaVariableName: 'title',
        headerName: 'Title',
        width: 100,
        enableSearch: true,
        searchDataType: 'string',
        hide: true,
    },
    {
        colId: 'series',
        field: 'series',
        javaVariableName: 'series',
        headerName: 'Series Title',
        width: 120,
        enableSearch: true,
        searchDataType: 'string',
        hide: true,
    },
    {
        colId: 'seasonNumber',
        field: 'seasonNumber',
        javaVariableName: 'seasonNumber',
        headerName: 'Season Number',
        width: 100,
        enableSearch: true,
        searchDataType: 'string',
        hide: true,
    },
    {
        colId: 'episodeNumber',
        field: 'episodeNumber',
        javaVariableName: 'episodeNumber',
        headerName: 'Episode Number',
        width: 100,
        enableSearch: true,
        searchDataType: 'string',
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
            value: Object.values(TASK_STATUS_ENUM).join(','),
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
    'coreTitleID',
    'title',
    'series',
    'seasonNumber',
    'episodeNumber',
];
export const DATE_FIELDS = [
    'activityEstimatedEndDate',
    'activityActualStartDate',
    'activityActualEndDate',
    'activityPlannedCompletionDate',
    'projectStartDate',
    'projectPlannedCompletionDate',
    'licenseStartDate',
];
export const FIELDS_OPERATOR_IN = ['language', 'locale', 'territory', 'affiliate', 'contentType', 'customPriority'];
export const CHANGE_PRIORITY_TITLE = 'Change Priority';
export const jobStatus = {
    SUCCESS: 'COMPLETED',
    ERROR: 'ERRORED',
    PARTIAL: 'Partially Completed',
    IN_PROGRESS: 'IN_PROGRESS',
};
export const TASK_ACTIONS_ASSIGN = 'Assign';
export const TASK_ACTIONS_UNASSIGN = 'Un-Assign';
export const TASK_ACTIONS_FORWARD = 'Forward';
export const PRIORITY_OPTIONS = [
    {
        value: 'Low',
        label: 'Low',
    },
    {
        value: 'Medium',
        label: 'Medium',
    },
    {
        value: 'High',
        label: 'High',
    },
];
