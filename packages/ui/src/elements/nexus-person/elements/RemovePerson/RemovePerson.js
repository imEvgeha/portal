import React from 'react';
import PropTypes from 'prop-types';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';

const RemovePerson = ({onClick}) => {
    return (
        <div className="nexus-c-person-action" onClick={onClick}>
            <EditorCloseIcon size="medium" label="" />
        </div>
    );
};

RemovePerson.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default RemovePerson;
