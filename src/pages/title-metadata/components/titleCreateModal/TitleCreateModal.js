import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ControllerWrapper from '@vubiquity-nexus/portal-ui/lib/elements/nexus-react-hook-form/ControllerWrapper';
import {addToast as toastDisplay} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {SUCCESS_TITLE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {getDomainName, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {get, isEmpty} from 'lodash';
import {Button} from 'primereact/button';
import {Checkbox} from 'primereact/checkbox';
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {useForm, useWatch} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import {Alert} from 'reactstrap';
import {store} from '../../../..';
import {rightsService} from '../../../legacy/containers/avail/service/RightsService';
import {publisherService} from '../../../legacy/containers/metadata/service/PublisherService';
import {titleService} from '../../../legacy/containers/metadata/service/TitleService';
import constants, {CONTENT_TYPE_ITEMS} from './TitleCreateModalConstants';
import './Title.scss';

const onViewTitleClick = (response, realm) => {
    const {id} = response || {};
    const url = `${getDomainName()}/${realm}/metadata/detail/${id}`;
    window.open(url, '_blank');
};

const TitleCreate = ({
    onSave,
    onCloseModal,
    tenantCode,
    display,
    isItMatching,
    focusedRight,
    bulkTitleMatch,
    defaultValues,
}) => {
    const {CREATE_TITLE_RESTRICTIONS, TENANT_CODE_ITEMS} = constants;
    const {MAX_TITLE_LENGTH, MAX_SEASON_LENGTH, MAX_EPISODE_LENGTH, MAX_RELEASE_YEAR_LENGTH} =
        CREATE_TITLE_RESTRICTIONS;
    const addToast = toast => store.dispatch(toastDisplay(toast));
    const {id: focusedId} = focusedRight;
    const [errorMessage, setErrorMessage] = useState('');
    const [isCreatingTitle, setIsCreatingTitle] = useState(false);
    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isValid, dirtyFields},
    } = useForm({
        defaultValues: {...defaultValues, catalogueOwner: tenantCode},
        mode: 'all',
        reValidateMode: 'onChange',
    });
    const currentValues = useWatch({control});
    const routeParams = useParams();

    useEffect(() => {
        setValue('catalogueOwner', tenantCode);
    }, [tenantCode]);

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            const keys = Object.keys(defaultValues);
            keys.forEach(key => {
                setValue(key, defaultValues[key]);
            });
        }
    }, [defaultValues]);

    const toggle = () => {
        onSave();
        setErrorMessage('');
        reset();
    };

    const handleError = (err, matching = false) => {
        setIsCreatingTitle(false);
        setErrorMessage(
            get(
                err,
                'response.data.description',
                matching ? constants.NEW_TITLE_TOAST_ERROR_PUBLISHING_MESSAGE : 'Title creation failed!'
            )
        );
    };

    const defaultCreateTitle = (title, params) => {
        titleService
            .createTitle(title, params)
            .then(response => {
                if (currentValues.syncVZ || currentValues.syncMovida) {
                    // call registerTitle API
                    publisherService
                        .registerTitle(response.id, currentValues.syncVZ, currentValues.syncMovida)
                        .then(response => {
                            addToast({
                                severity: 'success',
                                content: () => {
                                    return (
                                        <ToastBody
                                            summary={SUCCESS_TITLE}
                                            detail={constants.NEW_TITLE_TOAST_SUCCESS_PUBLISHING_MESSAGE}
                                            severity="success"
                                        >
                                            <Button
                                                label="View Title"
                                                className="p-button-link p-toast-button-link"
                                                onClick={() => onViewTitleClick(response, routeParams.realm)}
                                            />
                                        </ToastBody>
                                    );
                                },
                            });
                        })
                        .catch(e => handleError(e, true));
                }
                setIsCreatingTitle(false);
                toggle();
                addToast({
                    severity: 'success',
                    content: () => {
                        return (
                            <ToastBody
                                summary={SUCCESS_TITLE}
                                detail={constants.NEW_TITLE_TOAST_SUCCESS_MESSAGE}
                                severity="success"
                            >
                                <Button
                                    label="View Title"
                                    className="p-button-link p-toast-button-link"
                                    onClick={() => onViewTitleClick(response, routeParams.realm)}
                                />
                            </ToastBody>
                        );
                    },
                });
            })
            .catch(handleError);
    };

    const matchCreateTitle = title => {
        titleService
            .createTitleWithoutErrorModal(title)
            .then(res => {
                const titleId = res.id;
                addToast({
                    severity: 'success',
                    content: (
                        <ToastBody
                            summary={SUCCESS_TITLE}
                            detail={constants.NEW_TITLE_TOAST_SUCCESS_MESSAGE}
                            severity="success"
                        >
                            <Button
                                label="View Title"
                                className="p-button-link p-toast-button-link"
                                onClick={() => onViewTitleClick(titleId, routeParams.realm)}
                            />
                        </ToastBody>
                    ),
                });
                if (URL.isEmbedded()) {
                    DOP.setErrorsCount(0);
                    DOP.setData({
                        match: {
                            rightId: focusedId,
                            titleId: res.id,
                        },
                    });
                } else if (bulkTitleMatch) {
                    bulkTitleMatch(titleId, true);
                } else {
                    const updatedRight = {coreTitleId: res.id};
                    rightsService.update(updatedRight, focusedId);
                }
                setIsCreatingTitle(false);
                toggle();
            })
            .catch(handleError);
    };

    const onSubmit = submitTitle => {
        setErrorMessage('');
        const title = getTitleWithoutEmptyField(submitTitle);
        const copyCastCrewFromSeason = Boolean(currentValues.addCrew);
        const params = {tenantCode, copyCastCrewFromSeason};
        setIsCreatingTitle(true);

        isItMatching ? matchCreateTitle(title) : defaultCreateTitle(title, params);
    };

    const getTitleWithoutEmptyField = titleForm => {
        const isEpisodicEmpty = titleForm.seriesTitleName || titleForm.episodeNumber || titleForm.seasonNumber;
        return {
            title: titleForm.title,
            releaseYear: titleForm.releaseYear || null,
            contentType: titleForm.contentType,
            episodic: isEpisodicEmpty
                ? {
                      seriesTitleName: titleForm.seriesTitleName || null,
                      episodeNumber: titleForm.episodeNumber || null,
                      seasonNumber: titleForm.seasonNumber || null,
                  }
                : null,
        };
    };

    const renderSyncCheckBoxes = () => (
        <div className="nexus-c-title-create_checkbox-container">
            <div className="row">
                <div className="col nexus-c-title-create_checkbox-wrapper">
                    <ControllerWrapper
                        title="Publish to VZ and Movida Int`l"
                        inputName="syncVZ"
                        errors={errors.syncVZ}
                        control={control}
                        register={register}
                        labelClassName="nexus-c-title-create_checkbox-label"
                        isItCheckbox
                    >
                        <Checkbox id="syncVZ" inputId="syncVZ" className="nexus-c-title-create_checkbox" />
                    </ControllerWrapper>
                </div>
            </div>
            <div className="row">
                <div className="col nexus-c-title-create_checkbox-wrapper">
                    <ControllerWrapper
                        title="Publish to Movida"
                        inputName="syncMovida"
                        errors={errors.syncMovida}
                        control={control}
                        register={register}
                        labelClassName="nexus-c-title-create_checkbox-label"
                        isItCheckbox
                    >
                        <Checkbox id="syncMovida" inputId="syncMovida" className="nexus-c-title-create_checkbox" />
                    </ControllerWrapper>
                </div>
            </div>
        </div>
    );

    const renderFooter = () => (
        <div className="nexus-c-title-create_footer-container">
            <div className="nx-stylish list-group nexus-c-title-create_footer-alert-container">
                {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            </div>
            <div className="nexus-c-title-create_footer-buttons-container">
                <Button
                    id="titleCancelBtn"
                    label="Cancel"
                    onClick={() => {
                        onCloseModal();
                        reset();
                    }}
                    disabled={isCreatingTitle}
                    className="p-button-outlined p-button-secondary"
                />
                <Button
                    id="titleSaveBtn"
                    label={isItMatching ? 'Match & Create' : 'Save'}
                    onClick={handleSubmit(onSubmit)}
                    loading={isCreatingTitle}
                    loadingIcon="pi pi-spin pi-spinner"
                    className="p-button-outlined"
                    iconPos="right"
                    disabled={!isValid || isEmpty(dirtyFields)}
                />
            </div>
        </div>
    );

    const fieldsToDisplay = () => {
        switch (currentValues.contentType) {
            case 'SEASON':
            case 'EPISODE':
            case 'EVENT':
            case 'SPORTS':
                return true;
            default:
                return false;
        }
    };
    const fieldsToDisplayAndHideForSeason = fieldsToDisplay() && currentValues.contentType !== 'SEASON';

    const areFieldsRequired = () => {
        switch (currentValues.contentType) {
            case 'SEASON':
            case 'EPISODE':
                return true;
            default:
                return false;
        }
    };

    return (
        <Dialog
            header="Create Title"
            visible={display}
            style={{width: '40vw'}}
            footer={renderFooter()}
            onHide={toggle}
            className="nexus-c-title-create_dialog"
            closeOnEscape={false}
            closable={false}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <ControllerWrapper
                                    title="Title"
                                    inputName="title"
                                    errors={errors.title}
                                    required={true}
                                    additionalValidation={{
                                        maxLength: {
                                            value: MAX_TITLE_LENGTH,
                                            message: `Max title length is ${MAX_TITLE_LENGTH}!`,
                                        },
                                    }}
                                    control={control}
                                    register={register}
                                >
                                    <InputText
                                        placeholder="Enter Title"
                                        id="title"
                                        className="nexus-c-title-create_input"
                                    />
                                </ControllerWrapper>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <ControllerWrapper
                                    title="Content Type"
                                    inputName="contentType"
                                    errors={errors.contentType}
                                    required={true}
                                    control={control}
                                    register={register}
                                >
                                    <Dropdown
                                        optionLabel="label"
                                        options={CONTENT_TYPE_ITEMS}
                                        disabled={isItMatching}
                                        id="contentType"
                                        className="nexus-c-title-create_input"
                                        placeholder="Select a Content Type"
                                    />
                                </ControllerWrapper>
                            </div>
                        </div>

                        {fieldsToDisplay() ? (
                            <div className="row">
                                <div className="col">
                                    <ControllerWrapper
                                        title="Series"
                                        inputName="seriesTitleName"
                                        control={control}
                                        errors={errors.seriesTitleName}
                                        required={areFieldsRequired()}
                                        register={register}
                                    >
                                        <InputText
                                            placeholder="Enter Series Name"
                                            id="seriesTitleName"
                                            className="nexus-c-title-create_input"
                                        />
                                    </ControllerWrapper>
                                </div>
                            </div>
                        ) : null}

                        {fieldsToDisplay() ? (
                            <div className="row">
                                <div className="col">
                                    <ControllerWrapper
                                        title="Season"
                                        inputName="seasonNumber"
                                        required={areFieldsRequired()}
                                        additionalValidation={{
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Please enter a valid season!',
                                            },
                                            maxLength: {
                                                value: MAX_SEASON_LENGTH,
                                                message: `Max season length is ${MAX_SEASON_LENGTH}!`,
                                            },
                                        }}
                                        register={register}
                                        control={control}
                                        errors={errors.seasonNumber}
                                    >
                                        <InputText
                                            placeholder="Enter Season Number"
                                            id="seasonNumber"
                                            className="nexus-c-title-create_input"
                                        />
                                    </ControllerWrapper>
                                </div>
                                {fieldsToDisplayAndHideForSeason ? (
                                    <div className="col">
                                        <ControllerWrapper
                                            title="Episode"
                                            inputName="episodeNumber"
                                            required={areFieldsRequired()}
                                            additionalValidation={{
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: 'Please enter a valid episode!',
                                                },
                                                maxLength: {
                                                    value: MAX_EPISODE_LENGTH,
                                                    message: `Max episode length is ${MAX_EPISODE_LENGTH}!`,
                                                },
                                            }}
                                            register={register}
                                            control={control}
                                            errors={errors.episodeNumber}
                                        >
                                            <InputText
                                                placeholder="Enter Episode Number"
                                                id="episodeNumber"
                                                className="nexus-c-title-create_input"
                                            />
                                        </ControllerWrapper>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        {fieldsToDisplayAndHideForSeason ? (
                            <div className="row">
                                <div className="col nexus-c-title-create_checkbox-wrapper">
                                    <ControllerWrapper
                                        title="Add Cast Crew from Season to episode"
                                        inputName="addCrew"
                                        errors={errors.addCrew}
                                        control={control}
                                        register={register}
                                        labelClassName="nexus-c-title-create_checkbox-label"
                                        isItCheckbox
                                    >
                                        <Checkbox
                                            id="addCrew"
                                            className="nexus-c-title-create_checkbox"
                                            inputId="addCrew"
                                        />
                                    </ControllerWrapper>
                                </div>
                            </div>
                        ) : null}

                        <div className="row">
                            <div className="col">
                                <ControllerWrapper
                                    title="Release Year"
                                    inputName="releaseYear"
                                    errors={errors.releaseYear}
                                    required={currentValues.contentType !== 'SERIES'}
                                    additionalValidation={{
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Please enter a valid year!',
                                        },
                                        maxLength: {
                                            value: MAX_RELEASE_YEAR_LENGTH,
                                            message: `Max release year length is ${MAX_RELEASE_YEAR_LENGTH}!`,
                                        },
                                        minLength: {
                                            value: MAX_RELEASE_YEAR_LENGTH,
                                            message: `Min release year length is ${MAX_RELEASE_YEAR_LENGTH}!`,
                                        },
                                    }}
                                    control={control}
                                    register={register}
                                >
                                    <InputText
                                        placeholder="Enter Release Year"
                                        id="titleReleaseYear"
                                        className="nexus-c-title-create_input"
                                    />
                                </ControllerWrapper>
                            </div>
                        </div>
                        {tenantCode && !isItMatching && (
                            <div className="row">
                                <div className="col">
                                    <ControllerWrapper
                                        title="Catalogue Owner"
                                        inputName="catalogueOwner"
                                        errors={errors.catalogueOwner}
                                        required={true}
                                        controllerClassName="nexus-c-title-create_catalogue-owner-dropdown-container"
                                        control={control}
                                        register={register}
                                    >
                                        <Dropdown
                                            optionLabel="label"
                                            disabled
                                            options={TENANT_CODE_ITEMS}
                                            id="catalogueOwner"
                                            className="nexus-c-title-create_input"
                                            placeholder="Select a Catalogue Owner"
                                        />
                                    </ControllerWrapper>
                                </div>
                            </div>
                        )}
                        {isItMatching ? null : renderSyncCheckBoxes()}
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

TitleCreate.propTypes = {
    onSave: PropTypes.func.isRequired,
    display: PropTypes.bool.isRequired,
    tenantCode: PropTypes.string,
    isItMatching: PropTypes.bool,
    bulkTitleMatch: PropTypes.func,
    focusedRight: PropTypes.object,
    onCloseModal: PropTypes.func.isRequired,
    defaultValues: PropTypes.object,
};

TitleCreate.defaultProps = {
    tenantCode: undefined,
    isItMatching: false,
    bulkTitleMatch: () => null,
    focusedRight: {},
    defaultValues: {},
};

export default TitleCreate;
