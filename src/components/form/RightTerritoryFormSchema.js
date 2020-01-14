export default (countryItems) => ([
    {
        id: 'create',
        name: 'create',
        type: 'checkbox',
        visible: false,
        omitWhenHidden: true,
        defaultValue: false
    },
    {
        id: 'country',
        label: 'COUNTRY',
        name: 'country',
        type: 'select',
        shouldFitContainer: true,
        required: true,
        disabledWhen: [
            {
                field: 'create',
                is: [
                    {value: false}
                ]
            }
        ],
        options: [
            {
                items: countryItems
            }
        ],
    },
    {
        id: 'selected',
        label: 'SELECTED',
        name: 'selected',
        type: 'select',
        options: [
            {
                items: [
                    { label: 'True', value: true },
                    { label: 'False', value: false },
                ],
            }
        ],
    },
    {
        id: 'dateSelected',
        label: 'DATE SELECTED',
        name: 'dateSelected',
        type: 'date',
    },
    {
        id: 'rightContractStatus',
        label: 'RIGHT CONTRACT STATUS',
        name: 'rightContractStatus',
        type: 'select',
        shouldFitContainer: true,
        required: true,
        options: [
            {
                items: [
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Pending Manual', value: 'PendingManual' },
                    { label: 'Matched Once', value: 'MatchedOnce' }
                ],
            }
        ],
    },
    {
        id: 'vuContractId',
        label: 'VU CONTRACT ID',
        name: 'vuContractId',
        type: 'multiselect',
        shouldFitContainer: true,
    },
    {
        id: 'hide',
        label: 'Hide',
        name: 'hide',
        type: 'select',
        options: [
            {
                items: [
                    { label: 'True', value: true },
                    { label: 'False', value: false },
                ],
            }
        ],
    },
    {
        id: 'comment',
        label: 'Comment',
        name: 'comment',
        type: 'text',
        shouldFitContainer: true,
    },
]);