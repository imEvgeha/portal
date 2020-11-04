import React from 'react';
import {Checkbox} from '@atlaskit/checkbox';
import {forIn, get, trimEnd} from 'lodash';

export const getToolTipText = components => {
    const list = [];
    forIn(components, (val, key) => {
        let tooltip = '';
        val.forEach((item, index) => {
            tooltip += `${(index + 1).toString()}. ${item.channelPosition}, `;
        });
        list.push({name: key, tooltip: trimEnd(tooltip, ', ')});
    });
    return list;
};

export const getAudioChannelsForLangTrack = (lang, track, audioComponentArray) => {
    const audioComponent = audioComponentArray.find(
        item => item.language === lang.value && item.trackConfiguration === track.value
    );
    return get(audioComponent, 'components', []);
};

export const createDynamicTableRows = (rowsArray, toggleRows) => {
    const setData = (name, isChecked) => {
        const newData = rowsArray.map(item => (item.sourceChannelNumber === name ? {...item, isChecked} : item));
        toggleRows(newData);
    };
    return rowsArray.map((item, index) => {
        return {
            key: index,
            cells: [
                {
                    key: `${index}-checkbox`,
                    content: (
                        <Checkbox
                            name={item.channelNumber}
                            isChecked={item.isChecked}
                            onChange={event => setData(item.sourceChannelNumber, event.target.checked)}
                        />
                    ),
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
