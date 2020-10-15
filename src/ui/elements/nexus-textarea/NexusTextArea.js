import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '@atlaskit/textarea';

const NexusTextArea = ({onTextChange, notesValue, ...restProps}) => (
    <TextArea
        appearance="standard"
        onChange={e => onTextChange(e.target.value)}
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
    onTextChange: null,
    notesValue: '',
};

export default NexusTextArea;
