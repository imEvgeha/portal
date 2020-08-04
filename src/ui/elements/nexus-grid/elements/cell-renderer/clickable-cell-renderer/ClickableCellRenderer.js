import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';

const ClickableCellRenderer = ({data = {}, onClick = null}) => {
    const handleClick = (data = {}) => {
        onClick(data);
    }

    return (
        <Button appearance="link" onClick={handleClick}>{data.status}</Button>
    );
}

ClickableCellRenderer.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,
}

ClickableCellRenderer.defaultProps = {
    onClick: () => null,
}

export default ClickableCellRenderer;
