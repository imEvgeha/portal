import React from 'react';
import PT from 'prop-types';
import {useDropdownContext} from '../../NexusDropdown';
import {Wrapper, Label, DotsIcon, ExtendedButton, PointDownIcon} from './styled';

const DropdownToggle = ({label, isMobile, ...otherProps}) => {
    const {isOpen, toggle} = useDropdownContext();

    return (
        <ExtendedButton
            onClick={toggle}
            appearance="primary"
            theme={(currentTheme, themeProps) => {
                const {buttonStyles, ...rest} = currentTheme(themeProps);
                return {
                    buttonStyles: {
                        ...buttonStyles,
                        background: '#f2f2f2',
                    },
                    ...rest,
                };
            }}
            {...otherProps}
        >
            <Wrapper>
                {isMobile ? (
                    <DotsIcon />
                ): (
                    <>
                        <Label>{label}</Label>
                        <PointDownIcon open={+isOpen} />
                    </>
                )}
            </Wrapper>
        </ExtendedButton>
    );
};

DropdownToggle.defaultProps = {
    isMobile: false,
};

DropdownToggle.propTypes = {
    label: PT.string.isRequired,
    isMobile: PT.bool,
};

export default DropdownToggle;
