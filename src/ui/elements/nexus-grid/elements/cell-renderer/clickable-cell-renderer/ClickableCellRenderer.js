import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';

const ClickableCellRenderer = ({data = {}, onClick = null, keyToDisplay = ''}) => {
    const handleClick = (data = {}) => onClick(data);

    return (
        <Button appearance="link" onClick={handleClick}>
            {data[keyToDisplay]}
        </Button>
    );
};

ClickableCellRenderer.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    keyToDisplay: PropTypes.string,
};

ClickableCellRenderer.defaultProps = {
    onClick: () => null,
    keyToDisplay: '',
};

export default ClickableCellRenderer;
