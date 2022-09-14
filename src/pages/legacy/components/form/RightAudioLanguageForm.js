import React from 'react';
import PropTypes from 'prop-types';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import Form from '@atlaskit/form';
import {Button} from '@portal/portal-components';
import {RIGHTS_CREATE, RIGHTS_EDIT} from '../../constants/constant-variables';
import {ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import RightAudioLanguageFields from './RightAudioLanguageFields';
import {getProperAudioLanguageFormValues} from './utils';

// TODO: write this from scratch
// component rerender 11 times
class RightAudioLanguageForm extends React.Component {
    onSubmit = data => {
        const properValues = getProperAudioLanguageFormValues(
            data,
            this.props.isEdit,
            this.props.existingAudioLanguageList,
            this.props.audioLanguageIndex
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
                                            <form {...formProps} className={`${className} audio-language-form`}>
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
                            Audio Language Data
                        </ModalHeader>
                        <RightAudioLanguageFields
                            languageOptions={this.props.languageOptions}
                            audioTypesOptions={this.props.audioTypesOptions}
                            isEdit={this.props.isEdit}
                            existingAudioLanguageList={this.props.existingAudioLanguageList || this.props.data}
                            audioLanguageIndex={this.props.audioLanguageIndex}
                        />
                        <ModalFooter>
                            <Button
                                label="Cancel"
                                className="p-button-outlined p-button-secondary"
                                onClick={e => {
                                    e.preventDefault();
                                    this.props.onClose(e);
                                }}
                            />
                            <Button
                                label={this.props.isEdit ? 'Update' : 'Create'}
                                className="p-button-outlined"
                                type="submit"
                            />
                        </ModalFooter>
                    </Modal>
                )}
            </ModalTransition>
        );
    }
}

RightAudioLanguageForm.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    languageOptions: PropTypes.array,
    audioTypesOptions: PropTypes.array,
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    existingAudioLanguageList: PropTypes.array,
};

RightAudioLanguageForm.defaultProps = {
    isEdit: false,
};

export default RightAudioLanguageForm;
