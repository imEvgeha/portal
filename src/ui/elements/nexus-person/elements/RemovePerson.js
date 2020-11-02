import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import './RemovePerson.scss';

const RemovePerson = ({onClick}) => {
    return (
        <Button className="nexus-c-remove-person" onClick={onClick} appearance="subtle-link">
            <EditorCloseIcon size="medium" label="" />
        </Button>
    );
};

RemovePerson.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default RemovePerson;
