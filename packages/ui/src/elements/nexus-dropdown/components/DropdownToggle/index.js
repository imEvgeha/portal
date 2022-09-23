import React from 'react';
import PT from 'prop-types';
import Button from '@atlaskit/button';
import {useDropdownContext} from '../../NexusDropdown';
import {Label, Wrapper} from './styled';

const DropdownToggle = ({label, isMobile, ...otherProps}) => {
    const {isOpen, toggle} = useDropdownContext();

    return (
        <Button
            onClick={toggle}
            appearance="primary"
            style={{background: '#f2f2f2', padding: '15px 21px', alignItems: 'center'}}
            {...otherProps}
        >
            <Wrapper>
                {isMobile ? (
                    <i className="po po-more" style={{color: 'black'}} />
                ) : (
                    <>
                        <Label>{label}</Label>
                        <i className={`po po-${isOpen ? 'collapse-section' : 'expand-section'}`} />
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
