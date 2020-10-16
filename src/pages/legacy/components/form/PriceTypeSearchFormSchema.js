export default (priceTypes, currencies) => {
    return [
        {
            id: 'priceType',
            label: 'Price Type',
            name: 'priceType',
            type: 'multiselect',
            shouldFitContainer: true,
            options: [
                {
                    items: priceTypes,
                },
            ],
        },
        {
            id: 'priceValue',
            label: 'Price Value',
            name: 'priceValue',
            type: 'text',
            shouldFitContainer: true,
        },
        {
            id: 'priceCurrency',
            label: 'Price Currency',
            name: 'priceCurrency',
            type: 'multiselect',
            shouldFitContainer: true,
            options: [
                {
                    items: currencies,
                },
            ],
            visibleWhen: [
                {
                    field: 'priceType',
                    isNot: ['Tier'],
                },
            ],
        },
    ];
};
