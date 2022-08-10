export const AudioLanguageTypeFormSchema = ({languages, audioTypes}) => {
    return [
        {
            id: 'audioTypeLanguageList',
            label: 'LANGUAGE',
            name: 'audioTypeLanguageList',
            type: 'multiselect',
            shouldFitContainer: true,
            required: true,
            options: [
                {
                    items: languages,
                },
            ],
        },
        {
            id: 'audioTypesList',
            label: 'AUDIO TYPE',
            name: 'audioTypesList',
            type: 'multiselect',
            shouldFitContainer: true,
            required: true,
            options: [
                {
                    items: audioTypes,
                },
            ],
        },
    ];
};

export const PriceTypeFormSchema = ({priceTypes, currencies}) => {
    return [
        {
            id: 'priceTypeList',
            label: 'Price Type',
            name: 'priceTypeList',
            type: 'select',
            shouldFitContainer: true,
            options: [
                {
                    items: priceTypes,
                },
            ],
        },
        {
            id: 'priceValueMatch',
            label: 'Price Value',
            name: 'priceValueMatch',
            type: 'text',
            shouldFitContainer: true,
        },
        {
            id: 'priceCurrencyList',
            label: 'Price Currency',
            name: 'priceCurrencyList',
            type: 'select',
            shouldFitContainer: true,
            options: [
                {
                    items: currencies,
                },
            ],
        },
    ];
};

export const RightTerritoryFormSchema = countryItems => [
    {
        id: 'create',
        name: 'create',
        type: 'checkbox',
        visible: false,
        omitWhenHidden: true,
        defaultValue: false,
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
                is: [{value: false}],
            },
        ],
        options: [
            {
                items: countryItems,
            },
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
                    {label: 'true', value: true},
                    {label: 'false', value: false},
                ],
            },
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
                    {label: 'Pending', value: 'Pending'},
                    {label: 'Pending Manual', value: 'PendingManual'},
                    {label: 'Matched Once', value: 'MatchedOnce'},
                ],
            },
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
                    {label: 'true', value: true},
                    {label: 'false', value: false},
                ],
            },
        ],
    },
    {
        id: 'dateWithdrawn',
        label: 'Date Withdrawn',
        name: 'dateWithdrawn',
        type: 'date',
        shouldFitContainer: true,
    },
    {
        id: 'comment',
        label: 'Comment',
        name: 'comment',
        type: 'text',
        shouldFitContainer: true,
    },
];
