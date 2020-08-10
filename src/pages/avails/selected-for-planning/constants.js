export const SELECTED_FOR_PLANNING_TAB = 'Selected for Planning';
export const PAGE_SIZE = 100;
export const PROJECT_ID = '5bbe8921-ab75-469b-b410-30955a0589d3';

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
            value: 'CIN PROGRESS',
        },
        {
            fieldName: 'TYPE',
            valueDataType: 'String',
            operator: 'in',
            logicalAnd: true,
            value: 'Rights_Planning',
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
        colId: 'id',
        field: 'rightID',
        headerName: 'Right ID',
        width: 120,
    },
    {
        colId: 'title',
        field: 'title',
        headerName: 'Title',
        width: 120,
    },
    {
        colId: 'territory',
        field: 'territory',
        headerName: 'Planned Territory',
        width: 150,
    },
    {
        colId: 'keywords',
        field: 'keywords',
        headerName: 'Keywords',
        width: 150,
    },
    {
        colId: 'status',
        field: 'status',
        headerName: 'DOP Status',
        width: 180,
    },
    {
        colId: 'format',
        field: 'format',
        headerName: 'Format',
        width: 120,
    },
    {
        colId: 'licensor',
        field: 'licensor',
        headerName: 'Licensor',
        width: 120,
    },
    {
        colId: 'licensee',
        field: 'licensee',
        headerName: 'Licensee',
        width: 120,
    },
    {
        colId: 'licenseType',
        field: 'licenseType',
        headerName: 'License type',
        width: 120,
    },
    {
        colId: 'transactionType',
        field: 'transactionType',
        headerName: 'License type',
        width: 120,
    },
];

export const PROJECT_SEARCH_MOCK_RESPONSE = [
    {
        name: 'Rights Planning (xx1234) 20200721034139',
        projectType: {
            id: '5bbe8921-ab75-469b-b410-30955a0589d3',
            version: [
                {
                    code: 'Select_Rights_for_Planning',
                    versionNumber: 1,
                },
            ],
        },
        plannedStartDate: '2020-07-21T03:41:39.000Z',
        plannedEndDate: '2020-07-21T04:01:39.000Z',
        action: 'Provide',
        manager: {
            userId: 'xx1234',
            name: 'xx1234',
        },
        owner: {
            userId: 'xx1234',
            name: 'xx1234',
        },
        errorCounter: 0,
        id: 'Project8680',
        href: 'https://dop.qa.vubiquity.com:8035/aff/rest/projectManagement/project/Project9484',
        version: '1',
        status: 'BNOT STARTED',
        statusChangedDate: '2020-07-21T00:41:31.182Z',
        plan: {
            id: 'A6FED2B34900454BA963ACBC19D801D11595292091',
        },
        estimatedEndDate: '2020-07-21T04:01:39.000Z',
        createdDate: '2020-07-21T00:41:31.187Z',
        lastUpdatedDate: '2020-07-21T00:41:31.201Z',
        isScheduled: false,
        isPONR: false,
        isHierarchy: false,
        projectStartDelay: {
            day: 0,
            hour: 0,
            minute: 0,
        },
        projectEndDelay: {
            day: 0,
            hour: 0,
            minute: 0,
        },
        projectStartDelayInMillis: 10954567,
        projectEndDelayInMillis: 9754567,
    },
    {
        name: 'Rights Planning (xx1234) 20200721094139',
        projectType: {
            id: '5bbe8921-ab75-469b-b410-30955a0589d3',
            version: [
                {
                    code: 'Select_Rights_for_Planning',
                    versionNumber: 1,
                },
            ],
        },
        plannedStartDate: '2020-07-21T09:41:39.000Z',
        plannedEndDate: '2020-07-21T10:01:39.000Z',
        action: 'Provide',
        manager: {
            userId: 'xx1234',
            name: 'xx1234',
        },
        owner: {
            userId: 'xx1234',
            name: 'xx1234',
        },
        errorCounter: 0,
        id: 'Project8679',
        href: 'https://dop.qa.vubiquity.com:8035/aff/rest/projectManagement/project/Project9489',
        version: '1',
        status: 'BNOT STARTED',
        statusChangedDate: '2020-07-21T06:44:04.939Z',
        plan: {
            id: '3B2B1E15E2C540B0AAE8A85DA862AC931595313845',
        },
        estimatedEndDate: '2020-07-21T10:01:39.000Z',
        createdDate: '2020-07-21T06:44:05.073Z',
        lastUpdatedDate: '2020-07-21T06:44:05.086Z',
        isScheduled: false,
        isPONR: false,
        isHierarchy: false,
        projectStartDelayInMillis: 0,
        projectEndDelayInMillis: 0,
    },
];

export const PROJECT_ATTRIBUTE_MOCK_RESPONSE = [
    {
        id: 'E4217CD571BF478DA6803B42B43D8919',
        code: 'PROJECT_NAME',
        value: 'Rights-Planning TANGLED (2010) (rght_468nk) [UG]',
        projectId: 'Project8680',
    },
    {
        id: '1C01F177C6F84665BE48AEC5261C0110',
        code: 'format',
        value: 'HD',
        projectId: 'Project8680',
    },
    {
        id: 'DE2F5C93D54B4018B979B2BD9B76293E',
        code: 'licensee',
        value: 'Vubiquity_UK',
        projectId: 'Project8680',
    },
    {
        id: 'E04F774A568B489C80F961D3E4A2CF15',
        code: 'licensor',
        value: 'Disney',
        projectId: 'Project8680',
    },
    {
        id: '38D5B195D19746D28CB3EE9AA12D24C7',
        code: 'platformCategory',
        projectId: 'Project8680',
    },
    {
        id: '3E273BA5288A436A90F59787897F9380',
        code: 'releaseYear',
        value: '2010',
        projectId: 'Project8680',
    },
    {
        id: '36EED2E5CC7E4CB9B153AF7A6A22992C',
        code: 'rightID',
        value: 'rght_468nk',
        projectId: 'Project8680',
    },
    {
        id: '5F00F196A32F4C8084298BD208383852',
        code: 'title',
        value: 'TANGLED (2010)',
        projectId: 'Project8680',
    },
    {
        id: '17E8D8B51C1B4CD1A238F06A44EAF337',
        code: 'transactionType',
        value: 'VOD',
        projectId: 'Project8680',
    },
    {
        id: '86D2E6398D284086B517F195418949C7',
        code: 'PROJECT_NAME',
        value: 'Rights-Planning AS ABOVE, SO BELOW (rght_466Mr) [GB]',
        projectId: 'Project8679',
    },
    {
        id: '7C1ED767983D46358795EBC8448AEADA',
        code: 'format',
        value: 'HD',
        projectId: 'Project8679',
    },
    {
        id: '88399C1164A3453F82E363D718B526B9',
        code: 'licensee',
        value: 'Vubiquity_UK',
        projectId: 'Project8679',
    },
    {
        id: '283F7EFE106740EEA0002C113B22D6DD',
        code: 'licensor',
        value: 'Universal',
        projectId: 'Project8679',
    },
    {
        id: '6915BDCCC8C6455B8A1FFE12C4A6FE44',
        code: 'platformCategory',
        projectId: 'Project8679',
    },
    {
        id: 'F82B1C0AA9A74A17BFAF1BC078665C94',
        code: 'releaseYear',
        value: '2014',
        projectId: 'Project8679',
    },
    {
        id: '8EDEFE5452C84359BB109BBEA37BE17E',
        code: 'rightID',
        value: 'rght_466Mr',
        projectId: 'Project8679',
    },
    {
        id: 'EBAD3ECD0BC3485F9231F4F0507E133D',
        code: 'title',
        value: 'AS ABOVE, SO BELOW',
        projectId: 'Project8679',
    },
    {
        id: '8AA9FD140390435CA49A34313E60678C',
        code: 'transactionType',
        value: 'EST',
        projectId: 'Project8679',
    },
];
