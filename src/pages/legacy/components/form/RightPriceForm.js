import React from 'react';
import PropTypes from 'prop-types';
import {ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import Form from '@atlaskit/form';
import {Button} from '@portal/portal-components';
import {getProperPriceFormValues} from './utils';
import {RIGHTS_CREATE, RIGHTS_EDIT} from '../../constants/constant-variables';
import RightPriceFields from './RightPriceFields';

// TODO: write this from scratch
// component rerender 11 times
class RightPriceForm extends React.Component {
    onSubmit = data => {
        const properValues = getProperPriceFormValues(
            data,
            this.props.isEdit,
            this.props.existingPriceList,
            this.props.priceIndex
        );
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
                            Container: ({children, className}) => (
                                <Form onSubmit={data => this.onSubmit(data)}>
                                    {({formProps}) => (
                                        <ModalBody>
                                            <form {...formProps} className={className}>
                                                {children}
                                            </form>
                                        </ModalBody>
                                    )}
                                </Form>
                            ),
                        }}
                    >
                        <ModalHeader>
                            <p style={{color: '#999', fontWeight: 'bold', fontSize: '11px'}}>
                                {this.props.isEdit ? RIGHTS_EDIT : RIGHTS_CREATE}
                            </p>
                            Price Data
                        </ModalHeader>
                        <RightPriceFields
                            priceTypeOptions={this.props.priceTypeOptions}
                            priceCurrencyOptions={this.props.priceCurrencyOptions}
                            isEdit={this.props.isEdit}
                            existingPriceList={this.props.existingPriceList || this.props.data}
                            priceIndex={this.props.priceIndex}
                        />
                        <ModalFooter>
                            <Button
                                className="p-button-outlined p-button-secondary"
                                label="Cancel"
                                appearance="default"
                                onClick={this.props.onClose}
                            />
                            <Button
                                className="p-button-outlined"
                                label={this.props.isEdit ? 'Update' : 'Create'}
                                appearance="primary"
                                type="submit"
                            />
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
    existingPriceList: PropTypes.array,
};

RightPriceForm.defaultProps = {
    isEdit: false,
};

export default RightPriceForm;
