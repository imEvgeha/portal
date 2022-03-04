import React from 'react';
import PropTypes from 'prop-types';
import {HelperMessage} from '@atlaskit/form';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import {SimpleTag as Tag} from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import './TextComponentPicker.scss';

// eslint-disable-next-line react/prop-types
export const ListItem = ({item, onDelete}) => {
    return (
        <div className="text-picker__list-item">
            <Tag text={item} />
            <div onClick={onDelete}>
                <EditorRemoveIcon size="medium" primaryColor="grey" />
            </div>
        </div>
    );
};

const TextSummaryPanel = ({list = [], remove}) => {
    const onDelete = key => remove(key);

    return (
        <div className="text-picker__summary-panel">
            <HelperMessage>Text Service Summary</HelperMessage>
            {list.map(item => (
                <Tooltip
                    key={item.amsComponentId}
                    content={`${item.language}, ${item.type}, Component ID ${item.amsComponentId}`}
                >
                    <ListItem item={`${item.language}  ${item.type}`} onDelete={() => onDelete(item.amsComponentId)} />
                </Tooltip>
            ))}
        </div>
    );
};

TextSummaryPanel.propTypes = {
    list: PropTypes.array.isRequired,
    remove: PropTypes.func,
};

TextSummaryPanel.defaultProps = {
    remove: () => null,
};

export default TextSummaryPanel;
