import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '@atlaskit/textarea';

const NexusTextArea = ({onTextChange, notesValue}) => {
    return (
        <div className="nexus-c-textarea">
            <h5>Notes:</h5>
            <TextArea
                appearance="standard"
                onChange={onTextChange}
                minimumRows={5}
                value={notesValue}
            />
        </div>
    );
};

NexusTextArea.propTypes = {
    onTextChange: PropTypes.func,
    notesValue: PropTypes.string,
};

NexusTextArea.defaultProps = {
    onTextChange: () => {},
    notesValue: '',
};

export default NexusTextArea;
