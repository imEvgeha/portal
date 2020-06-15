import React from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Form from '@atlaskit/form';
import Button from '@atlaskit/button';
import { RIGHTS_CREATE, RIGHTS_EDIT } from '../../constants/constant-variables';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import RightPriceFields from './RightPriceFields';
import {getProperPriceFormValues} from './utils';

// TODO: write this from scratch
// component rerender 11 times
class RightPriceForm extends React.Component {

    onSubmit = data => {
        const properValues = getProperPriceFormValues(data, this.props.isEdit, this.props.existingPriceList, this.props.priceIndex);
        if (properValues) {
            this.props.onSubmit(properValues);
            this.props.onClose();
        }
    };

    render() {

        return (
            <ModalTransition>
                {this.props.isOpen && (
                    <Modal
                        width="medium"
                        onClose={this.props.onClose}
                        components={{
                            Container: ({ children, className }) => (
                                <Form onSubmit={data => this.onSubmit(data)}>
                                    {({ formProps }) => (
                                        <ModalBody>
                                            <form {...formProps} className={className}>
                                                {children}
                                            </form>
                                        </ModalBody>
                                    )}
                                </Form>
                            )
                        }}
                    >
                        <ModalHeader><p style={{ color: '#999', fontWeight: 'bold', fontSize: '11px' }}>{this.props.isEdit ? RIGHTS_EDIT : RIGHTS_CREATE}</p>Price Data</ModalHeader>
                        <RightPriceFields
                            priceTypeOptions={this.props.priceTypeOptions}
                            priceCurrencyOptions={this.props.priceCurrencyOptions}
                            isEdit={this.props.isEdit}
                            existingPriceList={this.props.existingPriceList || this.props.data}
                            priceIndex={this.props.priceIndex}
                        />
                        <ModalFooter>
                            <Button appearance="default" onClick={this.props.onClose}>
                                Cancel
                            </Button>
                            <Button appearance="primary" type="submit">
                                {this.props.isEdit ? 'Update' : 'Create'}
                            </Button>
                        </ModalFooter>
                    </Modal>
                )}
            </ModalTransition>
        );
    }
}

RightPriceForm.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    priceTypeOptions: PropTypes.array,
    priceCurrencyOptions: PropTypes.array,
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    existingPriceList: PropTypes.array
};

RightPriceForm.defaultProps = {
    isEdit: false,
};

export default RightPriceForm;
