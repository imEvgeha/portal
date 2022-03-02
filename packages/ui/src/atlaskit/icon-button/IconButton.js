import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';

const IconButton = ({icon, onClick, label, isDisabled}) => {
    const Icon = icon;

    return (
        <div className="nexus-c-icon-button">
            <Tooltip content={label}>
                <Button
                    appearance="subtle"
                    onClick={onClick}
                    isDisabled={isDisabled}
                    iconBefore={<Icon label={label} />}
                />
            </Tooltip>
        </div>
    );
};

IconButton.propTypes = {
    icon: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    label: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
};

IconButton.defaultProps = {
    onClick: () => null,
    isDisabled: false,
};

export default IconButton;
