const dataTypes = {
    DATE: 'date',
    AUDIO: 'audio',
    FORMAT: 'format',
    RATING: 'rating',
    AFFILIATE: 'affiliate',
};

export default {
    dataTypes,
    columns: [
        {
            field: 'updatedBy',
            headerName: 'Author',
            dataType: dataTypes.DATE,
            noStyles: true
        },
        {
            field: 'method',
            headerName: 'Method',
            noStyles: true
        },
        {
            field: 'lastUpdateReceivedAt',
            headerName: 'Last Received',
            dataType: dataTypes.DATE,
            noStyles: true
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
            field: 'audioDescription',
            headerName: 'Audio Language',
            dataType: dataTypes.AUDIO,
        },
        {
            field: 'affiliate',
            headerName: 'Affiliate',
            dataType: dataTypes.AFFILIATE,
        },
        {
            field: 'contentType',
            headerName: 'Offer Type',
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
            field: 'licenseCategory',
            headerName: 'License Category',
        },
        {
            field: 'format',
            headerName: 'Format',
            dataType: dataTypes.FORMAT,
        },
        {
            field: 'wsp',
            headerName: 'WSP',
        },
        {
            field: 'licenseStatus',
            headerName: 'License Status',
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
    }
};