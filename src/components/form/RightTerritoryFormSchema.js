export default (countryItems) => ([
    {
        id: 'country',
        label: 'COUNTRY',
        name: 'country',
        type: 'select',
        shouldFitContainer: true,
        required: true,
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
        type: 'checkbox',
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
        type: 'select',
        shouldFitContainer: true,
    },
]);