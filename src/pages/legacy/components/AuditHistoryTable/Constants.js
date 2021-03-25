const dataTypes = {
    DATE: 'date',
    AUDIO: 'audio',
    RATING: 'rating',
    METHOD: 'method',
    YES_OR_NO: 'yesOrNo',
};

export default {
    dataTypes,
    columns: [
        {
            field: 'updatedBy',
            headerName: 'Author',
            noStyles: true,
        },
        {
            field: 'method',
            headerName: 'Method',
            noStyles: true,
            dataType: dataTypes.METHOD,
        },
        {
            field: 'lastUpdateReceivedAt',
            headerName: 'Last Received',
            dataType: dataTypes.DATE,
            noStyles: true,
        },
        {
            field: 'updatedAt',
            headerName: 'Last Updated',
            dataType: dataTypes.DATE,
        },
        {
            field: 'title',
            headerName: 'Title',
        },
        {
            field: 'start',
            headerName: 'Start',
            dataType: dataTypes.DATE,
        },
        {
            field: 'end',
            headerName: 'End',
            dataType: dataTypes.DATE,
        },
        {
            field: 'licensor',
            headerName: 'Licensor',
        },
        {
            field: 'licensed',
            headerName: 'Licensed',
            dataType: dataTypes.YES_OR_NO,
        },
        {
            field: 'rightStatus',
            headerName: 'Right Status',
        },
        {
            field: 'status',
            headerName: 'Status',
        },
        {
            field: 'keywords',
            headerName: 'Keywords',
        },
        {
            field: 'licensee',
            headerName: 'Licensee',
        },
        {
            field: 'languageAudioTypes',
            headerName: 'Audio Language',
            dataType: dataTypes.AUDIO,
        },
        {
            field: 'affiliate',
            headerName: 'Affiliate',
        },
        {
            field: 'contentType',
            headerName: 'Content Type',
        },
        {
            field: 'availStart',
            headerName: 'Avail Start',
            dataType: dataTypes.DATE,
        },
        {
            field: 'availEnd',
            headerName: 'Avail End',
            dataType: dataTypes.DATE,
        },
        {
            field: 'startLag',
            headerName: 'Start Lag',
        },
        {
            field: 'productionStudio',
            headerName: 'Production Studio',
        },
        {
            field: 'platformCategory',
            headerName: 'Platform Category',
        },
        {
            field: 'contractId',
            headerName: 'Contract Id',
        },
        {
            field: 'titleStatus',
            headerName: 'Title Status',
        },
        {
            field: 'coreTitleId',
            headerName: 'Core Title Id',
        },
        {
            field: 'storeLanguage',
            headerName: 'Store Language',
        },
        {
            field: 'ALID',
            headerName: 'ALID',
        },
        {
            field: 'CID',
            headerName: 'CID',
        },
        {
            field: 'licenseRightsDescription',
            headerName: 'License Rights Description',
        },
        {
            field: 'territoryExcluded',
            headerName: 'Territory Excluded',
        },
        {
            field: 'region',
            headerName: 'Region',
        },
        {
            field: 'regionExcluded',
            headerName: 'Region Excluded',
        },
        {
            field: 'genres',
            headerName: 'Genres',
        },
        {
            field: 'bonusRight',
            headerName: 'Bonus Right',
            dataType: dataTypes.YES_OR_NO,
        },
        {
            field: 'affiliateExclude',
            headerName: 'Affiliate Exclude',
        },
        {
            field: 'assetLanguage',
            headerName: 'Asset Language',
        },
        {
            field: 'language',
            headerName: 'Language',
        },
        {
            field: 'localizationType',
            headerName: 'Localization Type',
        },
        {
            field: 'holdbackLanguage',
            headerName: 'Holdback Language',
        },
        {
            field: 'allowedLanguages',
            headerName: 'Allowed Languages',
        },
        {
            field: 'requiredFulfillmentLanguages',
            headerName: 'Required Fulfillment Languages',
        },
        {
            field: 'entryType',
            headerName: 'Entry Type',
        },
        {
            field: 'displayTitle',
            headerName: 'Display Title',
        },
        {
            field: 'groupIdentity',
            headerName: 'Group Identity',
        },
        {
            field: 'companyDisplayCredit',
            headerName: 'Company Display Credit',
        },
        {
            colId: 'ratingSystem',
            field: 'rating',
            headerName: 'RatingSystem',
            dataType: dataTypes.RATING,
        },
        {
            colId: 'ratingValue',
            field: 'rating',
            headerName: 'RatingValue',
            dataType: dataTypes.RATING,
        },
        {
            field: 'licenseType',
            headerName: 'License Type',
        },
        {
            field: 'format',
            headerName: 'Format',
        },
    ],
    HEADER_ROW: {
        updatedBy: '-',
        method: '-',
        headerRow: true,
    },
    SEPARATION_ROW: {
        updatedBy: '-',
        method: '-',
        lastUpdateReceivedAt: 'History(+/-)',
        headerRow: true,
        separationRow: true,
    },
    SYSTEM: 'service-account-avails-client',
    RULES_ENGINE_INFO: [
        {
            field: 'templateName',
            displayName: 'Template Name',
        },
        {
            field: 'transformMethod',
            displayName: 'Transform Method',
        },
        {
            field: 'availColumn',
            displayName: 'Avail column',
        },
        {
            field: 'availRow',
            displayName: 'Avail Row',
        },
        {
            field: 'fileName',
            displayName: 'Filename',
        },
        {
            field: 'tabName',
            displayName: 'Sheet Name',
        },
    ],
    colors: {
        CURRENT_VALUE: 'LightGreen',
        STALE_VALUE: 'coral',
    },
    RATING_SUBFIELD: 'com.vubiquity.messaging.rights.Rating',
    method: {
        INGEST: 'Ingest',
        MANUAL: 'Manual',
    },
    INGEST_ACCOUNTS: ['service-account-avails-client'],
    COLUMN_TOOL_PANEL: [
        {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true,
            },
        },
    ],
};
