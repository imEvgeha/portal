export const SELECT_VALUES = {
    operationalStatus: ['New', 'Accepted', 'Rejected', 'Complete', 'Cancelled', 'Failed'],
    type: ['Subtitles', 'Audio', 'Video'],
    version: [
        {subtitles: ['English', 'French', 'Italian']},
        {audio: ['English', 'French', 'Italian']},
        {video: ['Theatrical', 'Broadcast', 'Director\'s cut']}
    ],
    standard: [
        {subtitles: ['Text Type - Full Stream', 'Forced', 'SDH']},
        {audio: ['Mono', 'Stereo', '2.0 LTRT', '3.0', '4.0', '5.0', '5.1', '6.1', '7.1', 'Dolby E']},
        {video: ['SD', 'HD', '4K']}
    ],
    priority:['10', '20', '60', '50'],
    operationalStatus: ['Ready', 'On Hold', 'In Progress'],
    componentId: ['LOL-123'],
    spec: ['M-DBS-2396 SCC'],
    addRecipient: ['MGM', 'Vubiquity'],
    sourceStandard: ['_1080_23_976']
};

export const TABLE_ROW = {
    componentId: '',
    spec: '',
    doNotStartBefore: '',
    priority: '10',
    deliverToVu: false,
    operationalStatus: 'Ready'
};

export const SERVICE_SCHEMA =
    {
        deteSources: {
          amsAssetId: '',
          barcode: '',
          externalSources: {
            externalId: '',
            externalSystem: '',
            assetFormat: '',
            assetType: ''
          }
        },
        deteTasks: {
          deteDeliveries: {
            deliveryMethod: '',
            externalDelivery: {
              externalId: '',
              externalSystem: '',
              customerId: '',
              deliverToId: ''
            }
          },
          dueDate: '',
          typeAttribute: ''
        },
        externalServices: {
          externalId: '',
          externalSystem: '',
          formatType: '',
          parameters: [
            {
              name: 'Priority',
              value: ''
            }
          ],
          requiresPropagation: '',
          serviceType: '',
          subordinateFlag: ''
        },
        mediaFormat: '',
        overrideDueDate: '',
        quantity: '',
        sequence: '',
        status: ''
      };
