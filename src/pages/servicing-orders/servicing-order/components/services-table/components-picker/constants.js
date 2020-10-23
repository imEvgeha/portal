import React from 'react';
import {Checkbox} from '@atlaskit/checkbox';

// eslint-disable-next-line react/prop-types
const Check = ({name, isChecked, toggle}) => (
    <Checkbox
        /* eslint-disable-next-line no-alert */
        onChange={event => toggle(name, event.target.checked)}
        name={name}
        isChecked={isChecked}
    />
);

export const header = {
    cells: [
        {
            key: 'radio',
            content: <Check name="header" />,
            width: 5,
        },
        {
            key: 1,
            content: 'Source Channel',
            width: 10,
        },
        {
            key: 2,
            content: 'Track Config',
            width: 10,
        },
        {
            key: 3,
            content: 'Channel Position',
            width: 15,
        },
        {
            key: 4,
            content: 'Content Type',
            width: 15,
        },
        {
            key: 5,
            content: 'Language',
            width: 15,
        },
        {
            key: 6,
            content: 'Component ID',
            width: 15,
        },
    ],
};

export const rows = [
    {
        key: '1',
        cells: [
            {key: '11-Channel', content: 1},
            {key: '12-track', content: 5.1},
            {key: '13-pos', content: 'Left'},
            {key: '14-type', content: 'Composite'},
            {key: '15-lang', content: 'French'},
            {key: '15-id', content: '429474-1'},
        ],
    },
    {
        key: '2',
        cells: [
            {key: '11-Channel', content: 1},
            {key: '12-track', content: 5.1},
            {key: '13-pos', content: 'Left'},
            {key: '14-type', content: 'Composite'},
            {key: '15-lang', content: 'French'},
            {key: '15-id', content: '429474-1'},
        ],
    },
    {
        key: '3',
        cells: [
            {key: '11-Channel', content: 1},
            {key: '12-track', content: 5.1},
            {key: '13-pos', content: 'Left'},
            {key: '14-type', content: 'Composite'},
            {key: '15-lang', content: 'French'},
            {key: '15-id', content: '429474-1'},
        ],
    },
    {
        key: '4',
        cells: [
            {key: '11-Channel', content: 1},
            {key: '12-track', content: 5.1},
            {key: '13-pos', content: 'Left'},
            {key: '14-type', content: 'Composite'},
            {key: '15-lang', content: 'French'},
            {key: '15-id', content: '429474-1'},
        ],
    },
    {
        key: '5',
        cells: [
            {key: '11-Channel', content: 1},
            {key: '12-track', content: 5.1},
            {key: '13-pos', content: 'Left'},
            {key: '14-type', content: 'Composite'},
            {key: '15-lang', content: 'French'},
            {key: '15-id', content: '429474-1'},
        ],
    },
    {
        key: '6',
        cells: [
            {key: '11-Channel', content: 1},
            {key: '12-track', content: 5.1},
            {key: '13-pos', content: 'Left'},
            {key: '14-type', content: 'Composite'},
            {key: '15-lang', content: 'French'},
            {key: '15-id', content: '429474-1'},
        ],
    },
];

export const createDynamicRows = (rowsArray, toggleRows) => {
    const setData = (name, isChecked) => {
        const newData = rowsArray.map(item => (item.channelNumber === name ? {...item, isChecked} : item));
        toggleRows(newData);
    };
    return rowsArray.map((item, index) => {
        return {
            key: index,
            cells: [
                {
                    key: `${index}-checkbox`,
                    content: <Check name={item.channelNumber} isChecked={item.isChecked} toggle={setData} />,
                },
                {key: `${index}-channel`, content: item.sourceChannelNumber},
                {key: `${index}-track`, content: item.trackConfig},
                {key: `${index}-pos`, content: item.channelPosition},
                {key: `${index}-type`, content: item.contentType},
                {key: `${index}-lang`, content: item.language},
                {key: `${index}-compId`, content: item.componentID},
            ],
        };
    });
};

const audioChannelsArray = [
    {
        sourceChannel: '1',
        trackConfig: '5.1',
        channelPosition: 'Left',
        contentType: 'Composite',
        language: 'French',
        componentId: '12345',
    },
    {
        sourceChannel: '2',
        trackConfig: '3.1',
        channelPosition: 'Left',
        contentType: 'Composite',
        language: 'French',
        componentId: '12315',
    },
    {
        sourceChannel: '3',
        trackConfig: '5.1',
        channelPosition: 'Right',
        contentType: 'Composite',
        language: 'English',
        componentId: '12355',
    },
    {
        sourceChannel: '4',
        trackConfig: '3.1',
        channelPosition: 'Left',
        contentType: 'Composite',
        language: 'English',
        componentId: '12375',
    },
    {
        sourceChannel: '5',
        trackConfig: '5.1',
        channelPosition: 'Left',
        contentType: 'Composite',
        language: 'English',
        componentId: '12745',
    },
    {
        sourceChannel: '6',
        trackConfig: '5.1',
        channelPosition: 'Left',
        contentType: 'Composite',
        language: 'French',
        componentId: '12345',
    },
    {
        sourceChannel: '7',
        trackConfig: '5.1',
        channelPosition: 'Right',
        contentType: 'Composite',
        language: 'Italian',
        componentId: '12385',
    },
    {
        sourceChannel: '8',
        trackConfig: '5.1',
        channelPosition: 'Left',
        contentType: 'Composite',
        language: 'French',
        componentId: '12115',
    },
    {
        sourceChannel: '9',
        trackConfig: '5.1',
        channelPosition: 'Right',
        contentType: 'Composite',
        language: 'Italian',
        componentId: '4445',
    },
];

export const createAudioData = data => {};

export const dummyData = {
    title: 'test title',
    barcode: 'DA10323',
    languageOptions: ['French', 'English', 'Italian'].map(item => {
        return {value: item, label: item};
    }),
    trackConfiguration: ['2.1', '3.1', '5.1'].map(item => {
        return {value: item, label: item};
    }),
    audioChannels: createDynamicRows(audioChannelsArray),
    audioSummary: ['English 5.1', 'French 5.1', 'Italian 5.1'],
};
