export default (languages, audioTypes) => {
    return [
        {
            id: 'audioTypeLanguage',
            label: 'Language',
            name: 'audioTypeLanguage',
            type: 'multiselect',
            shouldFitContainer: true,
            options: [
                {
                    items: languages,
                },
            ],
        },
        {
            id: 'audioType',
            label: 'Audio Type',
            name: 'audioType',
            type: 'multiselect',
            shouldFitContainer: true,
            options: [
                {
                    items: audioTypes,
                },
            ],
        },
    ];
};
