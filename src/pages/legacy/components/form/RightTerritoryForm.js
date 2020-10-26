import React from 'react';
import PropTypes from 'prop-types';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import Form from '@atlaskit/form';
import Button from '@atlaskit/button';
import {RIGHTS_CREATE, RIGHTS_EDIT} from '../../constants/constant-variables';
import {ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import RightTerritoryFields from './RightTerritoryFields';
import {getProperTerritoryFormValues} from './utils';

// TODO: write this from scratch
// component rerender 11 times
class RightTerritoryForm extends React.Component {
    onSubmit = data => {
        const {territory} = this.props;
        let dataWithWithdrawn = data;
        if (territory && Array.isArray(territory) && territory.length > 0) {
            if (this.props.territoryIndex && this.props.territoryIndex >= 0) {
                if (territory[this.props.territoryIndex].hasOwnProperty('withdrawn')) {
                    const withdrawn = territory[this.props.territoryIndex].withdrawn;
                    dataWithWithdrawn = {...dataWithWithdrawn, withdrawn: withdrawn};
                }
            }
        }
        const properValues = getProperTerritoryFormValues(
            dataWithWithdrawn,
            this.props.isEdit,
            this.props.existingTerritoryList,
            this.props.territoryIndex
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
                            Territory Data
                        </ModalHeader>
                        <RightTerritoryFields
                            options={this.props.options}
                            isEdit={this.props.isEdit}
                            isFromCreatePage={this.props.isFromCreatePage}
                            existingTerritoryList={this.props.existingTerritoryList || this.props.data}
                            territoryIndex={this.props.territoryIndex}
                            isBonusRight={this.props.isBonusRight}
                        />
                        <ModalFooter>
                            <Button appearance="default" onClick={this.props.onClose}>
                                Cancel
                            </Button>
                            <Button appearance="primary" type="submit" isDisabled={this.props.isBonusRight}>
                                {this.props.isEdit ? 'Update' : 'Create'}
                            </Button>
                        </ModalFooter>
                    </Modal>
                )}
            </ModalTransition>
        );
    }
}

RightTerritoryForm.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    options: PropTypes.array,
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    isFromCreatePage: PropTypes.bool,
    existingTerritoryList: PropTypes.array,
    isBonusRight: PropTypes.bool,
    territory: PropTypes.array,
};

RightTerritoryForm.defaultProps = {
    isEdit: false,
    isFromCreatePage: false,
    isBonusRight: false,
    territory: [],
};

export default RightTerritoryForm;
