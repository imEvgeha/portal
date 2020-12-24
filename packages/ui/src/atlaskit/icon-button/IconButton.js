import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {gridSize} from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';

const GRID_SIZE_MULTIPLIER = 4;

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
                    theme={(currentTheme, themeProps) => {
                        const {buttonStyles, ...rest} = currentTheme(themeProps);
                        return {
                            buttonStyles: {
                                ...buttonStyles,
                                width: gridSize() * GRID_SIZE_MULTIPLIER,
                                height: gridSize() * GRID_SIZE_MULTIPLIER,
                                padding: 0,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                            ...rest,
                        };
                    }}
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
