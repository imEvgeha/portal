import React, {useState} from 'react';
import PropTypes from 'prop-types';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import './NexusEditableTag.scss';

const ENTER_KEY_CODE = 13;

const NexusEditableTag = ({text, remove, save, index, inputWidth, isEdit}) => {
    const [isEditing, setEditing] = useState(false);
    const [value, setValue] = useState(text);

    const handleKeyDown = e => {
        if (e.keyCode === ENTER_KEY_CODE) {
            setEditing(false);
            typeof save === 'function' && index !== null && save(index, e.target.value);
        }
    };

    const onBlur = e => {
        isEditing && typeof save === 'function' && index !== null && save(index, e.target.value);
        setEditing(prev => !prev);
    };

    return isEditing && isEdit ? (
        <span className="nexus-edit-tag">
            <input
                className="nexus-edit-tag-input"
                style={{width: inputWidth}}
                value={value}
                onChange={e => setValue(e.target.value)}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                autoFocus
            />
        </span>
    ) : (
        <span className="nexus-edit-tag">
            <span onClick={() => setEditing(prev => !prev)} className="nexus-edit-tag__label">
                {value}
                {isEdit && (
                    <span className="nexus-edit-tag__remove-button" onClick={remove}>
                        <EditorCloseIcon size="small" />
                    </span>
                )}
            </span>
        </span>
    );
};

NexusEditableTag.propTypes = {
    text: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    inputWidth: PropTypes.string,
    save: PropTypes.func,
    index: PropTypes.number,
    isEdit: PropTypes.bool,
};

NexusEditableTag.defaultProps = {
    index: null,
    inputWidth: '220px',
    save: null,
    isEdit: false,
};

export default NexusEditableTag;
