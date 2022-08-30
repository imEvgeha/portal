import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {InputText, Dialog, Button, InputTextarea} from '@portal/portal-components';
import {FormProvider, useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {addToast} from '../../toast/NexusToastNotificationActions';
import {AUTO_DECORATE_RESTRICTIONS, SUCCESS_TOAST_MESSAGE, ERROR_TOAST_MESSAGE} from './constants';

const TitleAutoDecorateModal = ({currentData, display, setDisplay, handleCloseModal, actions}) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const initialValues = {
        autoDecorateTitle: '',
        displayTitle: currentData?.title?.title || '',
        shortTitle: currentData?.title?.shortTitle || '',
        shortSynopsis: currentData?.synopsis?.shortSynopsis || '',
        mediumSynopsis: currentData?.synopsis?.mediumSynopsis || '',
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

    const resetFormValues = () => {
        reset(initialValues);
    };

    const onSubmit = submitDecorateForm => {
        setIsLoading(true);
        if (isValid) {
            const decorateBody = {
                mediumSynopsis: submitDecorateForm?.mediumSynopsis,
                shortSynopsis: submitDecorateForm?.shortSynopsis,
                shortTitleTemplate: submitDecorateForm?.autoDecorateTitle,
                title: submitDecorateForm?.displayTitle,
            };
            const decorateFrom = {
                ...currentData,
                decorateBody,
            };
            saveAutoDecorate(decorateFrom);
        }
    };

    const saveAutoDecorate = decorateForm => {
        actions
            .saveAutoDecorate(decorateForm)
            .then(() => {
                successAutoDecorate();
            })
            .catch(handleError);
    };

    const handleError = err => {
        setIsLoading(false);

        dispatch(
            addToast({
                detail: err.message.description || ERROR_TOAST_MESSAGE,
                severity: 'error',
            })
        );
    };

    const successAutoDecorate = () => {
        setIsLoading(false);
        resetFormValues();
        handleCloseModal();
        setDisplay(false);
        dispatch(
            addToast({
                detail: SUCCESS_TOAST_MESSAGE,
                severity: 'success',
            })
        );
        actions.setRefresh(prev => !prev);
    };

    /**
     * Create a footer for modal
     * @returns return footer
     */
    const renderFooter = () => {
        return (
            <div className="row">
                <div className="col-12 text-end">
                    <Button
                        id="titleCancelBtn"
                        label="Cancel"
                        onClick={() => {
                            handleCloseModal();
                            resetFormValues();
                        }}
                        className="p-button-outlined p-button-secondary"
                    />
                    <Button
                        id="titleAutoDecorateBtn"
                        label="Auto-Decorate"
                        onClick={async e => {
                            await handleSubmit(onSubmit)(e);
                        }}
                        loadingIcon="pi pi-spin pi-spinner"
                        className="p-button-outlined"
                        iconPos="left"
                        loading={isLoading}
                    />
                </div>
            </div>
        );
    };

    return (
        <Dialog
            header="Auto-Decorate Editorial Metadata"
            visible={display}
            style={{width: '40vw'}}
            onHide={() => null}
            footer={renderFooter()}
            closeOnEscape={false}
            closable={false}
        >
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row pt-1">
                        <InputText
                            formControlOptions={{
                                formControlName: `autoDecorateTitle`,
                                rules: {
                                    required: {value: true, message: 'Field cannot be empty!'},
                                    maxLength: {
                                        value: AUTO_DECORATE_RESTRICTIONS.MAX_TITLE_LENGTH,
                                        message: `Max title length is ${AUTO_DECORATE_RESTRICTIONS.MAX_TITLE_LENGTH}!`,
                                    },
                                },
                            }}
                            labelProps={{label: 'Auto-Decorate Title', stacked: true, isRequired: true}}
                            id="autoDecorateTitle"
                            placeholder="Enter Auto-Decorate Title"
                        />
                        <InputText
                            formControlOptions={{
                                formControlName: `displayTitle`,
                                rules: {
                                    required: {value: true, message: 'Field cannot be empty!'},
                                    maxLength: {
                                        value: AUTO_DECORATE_RESTRICTIONS.DISPLAY_TITLE_LENGTH,
                                        message: `Max title length is ${AUTO_DECORATE_RESTRICTIONS.DISPLAY_TITLE_LENGTH}!`,
                                    },
                                },
                            }}
                            labelProps={{label: 'Display Title', stacked: true, isRequired: true}}
                            id="displayTitle"
                            placeholder="Enter Display Title"
                        />
                        <InputText
                            formControlOptions={{
                                formControlName: `shortTitle`,
                                rules: {
                                    maxLength: {
                                        value: AUTO_DECORATE_RESTRICTIONS.MAX_SHORT_TITLE_LENGTH,
                                        message: `Max title length is ${AUTO_DECORATE_RESTRICTIONS.MAX_SHORT_TITLE_LENGTH}!`,
                                    },
                                },
                            }}
                            labelProps={{label: 'Short Title', stacked: true, isRequired: false}}
                            id="shortTitle"
                            placeholder="Enter Short Title"
                        />
                        <InputTextarea
                            formControlOptions={{
                                formControlName: `shortSynopsis`,
                                rules: {
                                    required: {value: true, message: 'Field cannot be empty!'},
                                    maxLength: {
                                        value: AUTO_DECORATE_RESTRICTIONS.MAX_SYNOPSIS_LENGTH,
                                        message: `Max title length is ${AUTO_DECORATE_RESTRICTIONS.MAX_SYNOPSIS_LENGTH}!`,
                                    },
                                },
                            }}
                            labelProps={{label: 'Short Synopsis', stacked: true, isRequired: true}}
                            id="shortSynopsis"
                            placeholder="Enter Short Synopsis"
                        />
                        <InputTextarea
                            formControlOptions={{
                                formControlName: `mediumSynopsis`,
                                rules: {
                                    required: {value: true, message: 'Field cannot be empty!'},
                                    maxLength: {
                                        value: AUTO_DECORATE_RESTRICTIONS.MAX_SYNOPSIS_LENGTH,
                                        message: `Max title length is ${AUTO_DECORATE_RESTRICTIONS.MAX_SYNOPSIS_LENGTH}!`,
                                    },
                                },
                            }}
                            labelProps={{label: 'Medium Synopsis', stacked: true, isRequired: true}}
                            id="mediumSynopsis"
                            placeholder="Enter Medium Synopsis"
                        />
                    </div>
                </form>
            </FormProvider>
        </Dialog>
    );
};

TitleAutoDecorateModal.propTypes = {
    currentData: PropTypes.object,
    actions: PropTypes.object,
    display: PropTypes.bool,
    setDisplay: PropTypes.func,
    handleCloseModal: PropTypes.func,
};

TitleAutoDecorateModal.defaultProps = {
    currentData: {},
    actions: {},
    display: false,
    setDisplay: () => null,
    handleCloseModal: () => null,
};

export default TitleAutoDecorateModal;
