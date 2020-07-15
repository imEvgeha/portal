import React from 'react';
import Button from '@atlaskit/button';
import PropTypes from 'prop-types';
import {gridSize} from '@atlaskit/theme';

const IconButton = ({icon, onClick}) => {
    return (
        <Button
            appearance="subtle"
            onClick={onClick}
            iconBefore={icon}
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
