export const SELECT_VALUES = {
    operationalStatus: ['New', 'Accepted', 'Rejected', 'Complete', 'Cancelled', 'Failed'],
    type: ['Subtitles', 'Audio', 'Video'],
    version: [
        {subtitles: ['English', 'French', 'Italian']},
        {audio: ['English', 'French', 'Italian']},
        {video: ['Theatrical', 'Broadcast', "Director's cut"]},
    ],
    standard: [
        {subtitles: ['Text Type - Full Stream', 'Forced', 'SDH']},
        {audio: ['Mono', 'Stereo', '2.0 LTRT', '3.0', '4.0', '5.0', '5.1', '6.1', '7.1', 'Dolby E']},
        {video: ['SD', 'HD', '4K']},
    ],
    priority: ['10', '20', '60', '50'],
    componentId: ['LOL-123'],
    spec: ['M-DBS-2396 SCC', 'TBD'],
    addRecipient: ['MGM', 'Vubiquity'],
    serviceType: 'Process & Deliver',
    assetType: ['', 'Audio', 'Video', 'Subtitles', 'Closed Captioning'],
    sourceStandard: [
        '24P',
        'PAL',
        'NTSC',
        '_1080_25',
        '_1080_29_97',
        '_1080_23_976',
        '_4K_UHD_SDR_23_976',
        '_4K_UHD_HDR_23_976',
        '_4K_UHD_HDR_29_97',
        '_4K_UHD_SDR_29_97',
        '_4K_UHD_HDR_25',
        '_4K_UHD_SDR_25',
        '_4K_UHD_SDR_30',
        '_4K_UHD_HDR_30',
        '_4K_UHD_SDR_60',
        '_4K_UHD_HDR_60',
    ],
    deliveryMethod: ['Aspera Servicing', 'IFT Servicing', 'SmartJog Servicing'],
};

export const TABLE_ROW = {
    componentId: '',
    spec: '',
    doNotStartBefore: '',
    priority: '10',
    deliverToVu: false,
    operationalStatus: 'Ready',
    sourceStandard: '',
    deliveryMethod: '',
};

export const SERVICE_SCHEMA = {
    deteSources: [
        {
            amsAssetId: '',
            barcode: '',
            externalSources: {
                externalId: '',
                externalSystem: '',
                assetFormat: '',
                assetType: '',
            },
        },
    ],
    deteTasks: {
        deteDeliveries: [
            {
                deliveryMethod: '',
                externalDelivery: {
                    externalId: '',
                    externalSystem: '',
                    customerId: '',
                    deliverToId: '',
                },
            },
        ],
        dueDate: '',
        typeAttribute: '',
    },
    externalServices: {
        externalId: '',
        externalSystem: '',
        formatType: '',
        parameters: [
            {
                name: 'Priority',
                value: '',
            },
        ],
        requiresPropagation: '',
        serviceType: SELECT_VALUES.serviceType,
        subordinateFlag: false,
    },
    mediaFormat: 'HD EDUB',
    overrideDueDate: '',
    overrideStartDate: '',
    quantity: '1',
    sequence: '1',
    status: 'Ready',
};

export const NO_SELECTION = 'Selection not available for this Asset type';
export const CLICK_FOR_SELECTION = 'Click to add / edit components';
export const OPERATIONAL_ERRORS = 'Operational status errors';

export const ErrorTestRows = [
    {error: 'This is test error 1', severity: 'ERROR'},
    {
        error:
            'This is test error 2.. and longer text... 1234567 longer text bla bla bla bla bla bla dhudhuiadwqjwhidwjid wdhuihduiwhduiqwdhuidh duw',
        severity: 'ERROR',
    },
    {error: 'This is test error 3', severity: 'ERROR'},
    {error: 'error 4', severity: 'ERROR'},
];
export const DETE_SERVICE_TYPE = 'DETE Recipient';

export const SOURCE_STANDARD = 'SourceStandard';
