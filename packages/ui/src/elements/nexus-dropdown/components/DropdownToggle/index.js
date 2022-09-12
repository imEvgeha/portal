import React from 'react';
import PT from 'prop-types';
import {Button} from '@portal/portal-components';
import {useDropdownContext} from '../../NexusDropdown';
import {Wrapper, Label, DotsIcon, PointDownIcon} from './styled';

const DropdownToggle = ({label, isMobile, ...otherProps}) => {
    const {isOpen, toggle} = useDropdownContext();

    return (
        <Button
            onClick={toggle}
            appearance="primary"
            style={{background: '#f2f2f2', padding: '15px 21px'}}
            {...otherProps}
        >
            <Wrapper>
                {isMobile ? (
                    <DotsIcon />
                ) : (
                    <>
                        <Label>{label}</Label>
                        <PointDownIcon open={+isOpen} />
                    </>
                )}
            </Wrapper>
        </Button>
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
