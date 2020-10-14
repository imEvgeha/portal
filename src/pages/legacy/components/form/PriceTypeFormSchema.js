export default ({priceTypes, currencies}) => {
    return [
        {
            id: 'priceType',
            label: 'Price Type',
            name: 'priceType',
            type: 'select',
            shouldFitContainer: true,
            required: true,
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
            required: true,
        },
        {
            id: 'priceCurrency',
            label: 'Price Currency',
            name: 'priceCurrency',
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
