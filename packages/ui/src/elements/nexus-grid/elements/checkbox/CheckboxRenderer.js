import React from 'react';
import PropTypes from 'prop-types';

const CheckboxRenderer = ({value, column, node, isNexusDisabled}) => {
    const checkedHandler = event => {
        node.setDataValue(column.colId, event.target.checked);
    };

    return isNexusDisabled && node.id && node.id.startsWith('titl_') ? (
        ''
    ) : (
        <input type="checkbox" onClick={checkedHandler} checked={value} />
    );
};

CheckboxRenderer.propTypes = {
    value: PropTypes.bool,
    column: PropTypes.object,
    node: PropTypes.object,
    isNexusDisabled: PropTypes.bool,
};

CheckboxRenderer.defaultProps = {
    value: false,
    column: {},
    node: {},
    isNexusDisabled: false,
};

export default CheckboxRenderer;
