import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, Button, Dropdown} from '@portal/portal-components';
import {RIGHTS_CREATE} from '../../constants/constant-variables';
import {FormProvider, useForm} from 'react-hook-form';

const RightAudioLanguageForm = ({onSubmit, isOpen, onClose, languageOptions, audioTypesOptions}) => {
    const onSubmitForm = submitForm => {
        if (isValid) {
            onSubmit(submitForm);
            onClose();
            reset(initialValues);
        }
    };

    const initialValues = {
        language: '',
        audioType: '',
    };

    const form = useForm({
        defaultValues: initialValues,
        mode: 'all',
        reValidateMode: 'onChange',
    });

    const {
        reset,
        handleSubmit,
        formState: {isValid},
    } = form;

    const renderHeader = () => {
        return (
            <div className="row">
                <h3 className="col-12 text-start">{RIGHTS_CREATE}</h3>
                <h4 className="col-12 text-start mt-2">Audio Language Data</h4>
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="row">
                <div className="col-12 text-end">
                    <Button
                        label="Cancel"
                        className="p-button-outlined p-button-secondary"
                        onClick={() => {
                            onClose();
                            reset(initialValues);
                        }}
                    />
                    <Button
                        label="Create"
                        className="p-button-outlined"
                        type="submit"
                        onClick={async e => {
                            await handleSubmit(onSubmitForm)(e);
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <Dialog
            header={renderHeader()}
            visible={isOpen}
            style={{width: '35vw'}}
            footer={renderFooter()}
            onHide={() => null}
            closeOnEscape={true}
            closable={false}
        >
            <FormProvider {...form}>
                <form className={`audio-language-form`} onSubmit={handleSubmit(onSubmitForm)}>
                    <Dropdown
                        labelProps={{
                            isRequired: true,
                            label: 'Language',
                            stacked: true,
                        }}
                        formControlOptions={{
                            formControlName: `language`,
                            rules: {
                                required: {value: true, message: 'Field cannot be empty!'},
                            },
                        }}
                        optionLabel={'label'}
                        id="language"
                        placeholder="Choose Language"
                        options={languageOptions}
                        columnClass="col-12"
                        filter={true}
                        name="language"
                    />
                    <Dropdown
                        labelProps={{
                            isRequired: true,
                            label: 'Audio Type',
                            stacked: true,
                        }}
                        formControlOptions={{
                            formControlName: `audioType`,
                            rules: {
                                required: {value: true, message: 'Field cannot be empty!'},
                            },
                        }}
                        id="audioType"
                        name="audioType"
                        placeholder="Choose Audio Type"
                        options={audioTypesOptions}
                        columnClass="col-12"
                        filter={true}
                    />
                </form>
            </FormProvider>
        </Dialog>
    );
};

RightAudioLanguageForm.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    languageOptions: PropTypes.array,
    audioTypesOptions: PropTypes.array,
    onSubmit: PropTypes.func,
};

RightAudioLanguageForm.defaultProps = {
    onSubmit: () => {},
    onClose: () => {},
    isOpen: false,
    languageOptions: [],
    audioTypesOptions: [],
};

export default RightAudioLanguageForm;
