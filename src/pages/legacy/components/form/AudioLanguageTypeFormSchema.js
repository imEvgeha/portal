export default ({languages, audioTypes}) => {
    return [
        {
            id: 'language',
            label: 'LANGUAGE',
            name: 'language',
            type: 'select',
            shouldFitContainer: true,
            required: true,
            options: [
                {
                    items: languages,
                },
            ],
        },
        {
            id: 'audioType',
            label: 'AUDIO TYPE',
            name: 'audioType',
            type: 'select',
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
