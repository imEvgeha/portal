import React from 'react';
import PropTypes from 'prop-types';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';

const EditPerson = ({onClick}) => {
    return (
        <div className="nexus-c-person-action" onClick={onClick}>
            <EditFilledIcon size="small" label="" />
        </div>
    );
};

EditPerson.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default EditPerson;
