import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import './NexusEditableTag.scss';

const ENTER_KEY_CODE = 13;

const NexusEditableTag = ({text, remove, save, index=null, inputWidth='220px'}) => {
    const [isEditing, setEditing] = useState(false);
    const [value, setValue] = useState(text);

    const handleKeyDown = e => {
        if (e.keyCode === ENTER_KEY_CODE) {
            setEditing(false);
            typeof save === 'function' && index !== null && save(index,e.target.value);
        }
    };

    if (isEditing) {
        return (
            <input
                className='nexus-edit-tag-input'
                style={{width: inputWidth}}
                value={value}
                onChange={e => setValue(e.target.value)}
                onBlur={()=>setEditing(prev => !prev)}
                onKeyDown={handleKeyDown}
                autoFocus
            />
        );
    }

    return (
        <span className='nexus-edit-tag'>
            <span onClick={()=>setEditing(prev => !prev)} className='nexus-edit-tag__label'>
                {value}
                <span className='nexus-edit-tag__remove-button' onClick={remove}> <EditorCloseIcon size='small' /></span>
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
};

export default NexusEditableTag;
