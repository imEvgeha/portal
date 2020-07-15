import Button from '@atlaskit/button';
import {gridSize} from '@atlaskit/theme';
import PropTypes from 'prop-types';
import React from 'react';

const IconButton = ({icon, onClick, label}) => {
    const Icon = icon;
    return (
        <Button
            appearance="subtle"
            onClick={onClick}
            iconBefore={<Icon label={label} />}
            theme={(currentTheme, themeProps) => {
                const {buttonStyles, ...rest} = currentTheme(themeProps);
                return {
                    buttonStyles: {
                        ...buttonStyles,
                        width: gridSize() * 4,
                        height: gridSize() * 4,
                        padding: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    ...rest,
                };
            }}
        />
    );
};

IconButton.propTypes = {
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func,
};

IconButton.defaultProps = {
    onClick: () => {},
};

export default IconButton;
