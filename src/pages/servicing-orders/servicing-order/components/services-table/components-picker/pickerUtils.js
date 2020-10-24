import React from 'react';
import {Checkbox} from '@atlaskit/checkbox';

// eslint-disable-next-line react/prop-types
export const Check = ({name, isChecked, toggle}) => (
    <Checkbox
        /* eslint-disable-next-line no-alert */
        onChange={event => toggle(name, event.target.checked)}
        name={name}
        isChecked={isChecked}
    />
);

export const createDynamicTableRows = (rowsArray, toggleRows) => {
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
