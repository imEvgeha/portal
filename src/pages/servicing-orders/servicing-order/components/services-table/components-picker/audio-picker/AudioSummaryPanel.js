import React from 'react';
import PropTypes from 'prop-types';
import {HelperMessage} from '@atlaskit/form';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import {SimpleTag as Tag} from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import './AudioComponentPicker.scss';

// eslint-disable-next-line react/prop-types
const ListItem = ({item, onDelete}) => {
    return (
        <div className="audio-picker__list-item">
            <Tag text={item} />
            <div onClick={onDelete}>
                <EditorRemoveIcon size="medium" primaryColor="grey" />
            </div>
        </div>
    );
};

const AudioSummaryPanel = ({list = [], remove}) => {
    const onDelete = key => remove(key);
    return (
        <div className="audio-picker__summary-panel">
            <HelperMessage>Audio Service Summary</HelperMessage>
            {list.map(item => (
                <Tooltip key={item.name} content={item.tooltip}>
                    <ListItem item={item.name} onDelete={() => onDelete(item.name)} />
                </Tooltip>
            ))}
        </div>
    );
};

AudioSummaryPanel.propTypes = {
    list: PropTypes.array.isRequired,
    remove: PropTypes.func.isRequired,
};

AudioSummaryPanel.defaultProps = {};

export default AudioSummaryPanel;
