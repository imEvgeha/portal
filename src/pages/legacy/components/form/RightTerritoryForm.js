import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import Form from '@atlaskit/form';
import {Button} from '@portal/portal-components';
import {RIGHTS_CREATE, RIGHTS_EDIT} from '../../constants/constant-variables';
import {ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import RightTerritoryFields from './RightTerritoryFields';
import {getProperTerritoryFormValues} from './utils';

// TODO: write this from scratch
// component rerender 11 times
class RightTerritoryForm extends React.Component {
    onSubmit = data => {
        const {territory, territoryIndex} = this.props;
        let dataWithWithdrawn = data;
        const isValidIndex = territoryIndex !== null && territoryIndex !== undefined && territoryIndex >= 0;
        if (territory && isValidIndex && territory[territoryIndex].hasOwnProperty('withdrawn')) {
            const withdrawn = get(territory[territoryIndex], 'withdrawn');
            dataWithWithdrawn = {...dataWithWithdrawn, withdrawn: withdrawn};
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
                            existingTerritoryList={this.props.territory}
                            territoryIndex={this.props.territoryIndex}
                            isBonusRight={this.props.isBonusRight}
                        />
                        <ModalFooter>
                            <Button
                                label="Cancel"
                                className="p-button-outlined p-button-secondary"
                                onClick={this.props.onClose}
                            />
                            <Button
                                label={this.props.isEdit ? 'Update' : 'Create'}
                                className="p-button-outlined"
                                type="submit"
                                disabled={e => {
                                    e.preventDefault();
                                    this.props.isBonusRight(e);
                                }}
                            />
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
