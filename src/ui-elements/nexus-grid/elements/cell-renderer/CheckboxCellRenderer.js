import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';

const CheckboxCellRenderer = (props) => {
    const onChange = value => {
    };

    return ( // eslint-disable-line
        <Checkbox 
            defaultChecked={true}
            onChange={onChange}
            name="nexus-c-checkbox-cell-renderer"
        />
    );
};

CheckboxCellRenderer.propTypes = {
    id: PropTypes.string,
};

CheckboxCellRenderer.defaultProps = {
    id: null,
};

export default CheckboxCellRenderer;
