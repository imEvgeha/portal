import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {gridSize} from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';

const GRID_SIZE_MULTIPLIER = 4;

const IconButton = ({icon, onClick, label}) => {
    const Icon = icon;

    return (
        <Tooltip content={label}>
            <Button
                appearance="subtle"
                onClick={onClick}
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
    );
};

IconButton.propTypes = {
    icon: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    label: PropTypes.string.isRequired,
};

IconButton.defaultProps = {
    onClick: () => null,
};

export default IconButton;
