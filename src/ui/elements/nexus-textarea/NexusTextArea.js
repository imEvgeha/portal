import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '@atlaskit/textarea';

const NexusTextArea = ({onTextChange, notesValue, isDisabled, ...restProps}) => (
    <TextArea
        appearance="standard"
        onChange={onTextChange}
        minimumRows={5}
        value={notesValue}
        {...restProps}
    />
);


NexusTextArea.propTypes = {
    onTextChange: PropTypes.func,
    notesValue: PropTypes.string,
};

NexusTextArea.defaultProps = {
    onTextChange: () => {},
    notesValue: '',
};

export default NexusTextArea;
