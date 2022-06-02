import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Restricted} from '@portal/portal-auth/permissions';
import {AutoComplete} from '@portal/portal-components';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import ControllerWrapper from '@vubiquity-nexus/portal-ui/lib/elements/nexus-react-hook-form/ControllerWrapper';
import {addToast as toastDisplay} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {SUCCESS_TITLE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {NEXUS_ENTITY_TYPES} from '@vubiquity-nexus/portal-ui/src/elements/nexus-entity/constants';
import {getDomainName, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {isEmpty} from 'lodash';
import {Button} from 'primereact/button';
import {Checkbox} from 'primereact/checkbox';
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {useForm, useWatch} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import {store} from '../../../..';
import {rightsService} from '../../../legacy/containers/avail/service/RightsService';
import {publisherService} from '../../../legacy/containers/metadata/service/PublisherService';
import {titleService} from '../../../legacy/containers/metadata/service/TitleService';
import constants, {CONTENT_TYPE_ITEMS} from './TitleCreateModalConstants';
import './Title.scss';

const onViewTitleClick = (response, realm) => {
    const {meta} = response || {};
    const url = `${getDomainName()}/${realm}/metadata/detail/${meta.id}`;
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
    error,
}) => {
    const {CREATE_TITLE_RESTRICTIONS} = constants;
    const {MAX_TITLE_LENGTH, MAX_SEASON_LENGTH, MAX_EPISODE_LENGTH, MAX_RELEASE_YEAR_LENGTH} =
        CREATE_TITLE_RESTRICTIONS;
    const addToast = toast => store.dispatch(toastDisplay(toast));
    const {id: focusedId} = focusedRight;
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

    // filtering on series name
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [filteredSeries, setFilteredSeries] = useState([]);

    useEffect(() => {
        if (error) {
            addToast({
                severity: 'error',
                detail: error,
                sticky: true,
            });
        }
    }, [error]);

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
        reset();
    };

    const handleError = err => {
        setIsCreatingTitle(false);
        addToast({
            severity: 'error',
            detail: err.message.description,
            sticky: true,
        });
    };

    const defaultCreateTitle = (title, params) => {
        titleService
            .createTitleV2(title, params)
            .then(response => {
                if (currentValues.syncVZ || currentValues.syncMovida) {
                    // call registerTitle API
                    publisherService
                        .registerTitle(response?.meta?.id, currentValues.syncVZ, currentValues.syncMovida)
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
                                onClick={() => onViewTitleClick(res, routeParams.realm)}
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
        const title = getTitleWithoutEmptyField(submitTitle);
        const copyCastCrewFromSeason = Boolean(currentValues.addCrew);
        const params = {copyCastCrewFromSeason};
        setIsCreatingTitle(true);

        isItMatching ? matchCreateTitle(title) : defaultCreateTitle(title, params);
    };

    /**
     * Get the response of the /search api and show it as filtered data
     * @param event Search string of the `Series` field
     */
    const searchSeries = async event => {
        setTimeout(async () => {
            let filteredSeries = [];
            // reset the selected series on new search string
            setSelectedSeries(null);
            // only invoke the API when the search query string is not empty
            if (event.query.trim().length) {
                const response = await titleService.freeTextSearch(
                    {title: event.query, contentType: 'SERIES', tenantCode},
                    0,
                    30
                );
                filteredSeries = response?.data;
            }

            setFilteredSeries(filteredSeries);
        }, 500);
    };

    /**
     * Template used for the list options of the `Series` AutoComplete component
     * @param seriesItem The found series object
     * @returns {JSX.Element} Returns a JSX.Element to be rendered as an option
     */
    const seriesTemplate = seriesItem => {
        return (
            <div className="series-item">
                {`${seriesItem.episodic.seriesTitleName}${seriesItem.releaseYear ? `, ${seriesItem.releaseYear}` : ``}`}
            </div>
        );
    };

    /**
     * Selected Item template for `Series` AutoComplete.
     * A concatination of series name and series year(if exists)
     * @param seriesItem The selected series from the results found
     * @returns {`${string}`|`${*}${string}`}
     */
    const selectedSeriesTemplate = seriesItem => {
        return `${seriesItem.episodic.seriesTitleName}${seriesItem.releaseYear ? `, ${seriesItem.releaseYear}` : ``}`;
    };

    const getTitleWithoutEmptyField = titleForm => {
        const tempTitle = {
            name: titleForm.title,
            releaseYear: titleForm.releaseYear || null,
            contentType: titleForm.contentType.toLowerCase(),
            contentSubType: titleForm.contentType.toLowerCase(),
        };
        // in case of season/episode/sports, adding more properties to payload
        if (fieldsToDisplay()) {
            // if adding a new season
            if (currentValues.contentType === 'SEASON') {
                tempTitle.parentId = {
                    contentType:
                        titleForm.contentType.toLowerCase() === 'season'
                            ? titleForm.seriesTitleName.contentType.toLowerCase() === 'series'
                                ? 'SERIES'
                                : ''
                            : '',
                    id: selectedSeries.id,
                };
                tempTitle.seasonNumber = titleForm.seasonNumber || null;
            }
        }

        return tempTitle;
    };

    const renderSyncCheckBoxes = () => (
        <Restricted resource="publishTitleMetadata">
            <div className="nexus-c-title-create_checkbox-container">
                <div className="row nexus-c-create-title-publish-header">
                    <NexusEntity type={NEXUS_ENTITY_TYPES.subsection} heading="PUBLISH" />
                </div>
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
        </Restricted>
    );

    const renderFooter = () => (
        <div className="nexus-c-title-create_footer-container">
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
                    disabled={false}
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
                    <div className="col-12">
                        <div className="row nexus-c-create-title-overview-header">
                            <NexusEntity type={NEXUS_ENTITY_TYPES.subsection} heading="OVERVIEW" />
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-sm-12">
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
                            <div className="col-lg-6 col-sm-12">
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
                                <div className="col-lg-6 col-sm-12">
                                    <ControllerWrapper
                                        title="Series"
                                        inputName="seriesTitleName"
                                        control={control}
                                        errors={errors.seriesTitleName}
                                        required={areFieldsRequired()}
                                        register={register}
                                    >
                                        <AutoComplete
                                            id="seriesTitleName"
                                            placeholder="Enter Series Name"
                                            value={selectedSeries}
                                            suggestions={filteredSeries}
                                            completeMethod={searchSeries}
                                            itemTemplate={seriesTemplate}
                                            selectedItemTemplate={selectedSeriesTemplate}
                                            columnClass="col-lg-12"
                                            onSelect={e => setSelectedSeries(e.value)}
                                            aria-label="Series"
                                        />
                                    </ControllerWrapper>
                                </div>
                                <div className="col-lg-6 col-sm-12">
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
                            </div>
                        ) : null}

                        {fieldsToDisplay() ? (
                            <div className="row">
                                {fieldsToDisplayAndHideForSeason ? (
                                    <div className="col-lg-6 col-sm-12">
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
                                <div className="col-lg-6 col-sm-12 nexus-c-title-create_checkbox-wrapper">
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
                            <div className="col-lg-6 col-sm-12">
                                <ControllerWrapper
                                    title="Release Year"
                                    inputName="releaseYear"
                                    errors={errors.releaseYear}
                                    required={true}
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
    error: PropTypes.string,
};

TitleCreate.defaultProps = {
    tenantCode: undefined,
    isItMatching: false,
    bulkTitleMatch: () => null,
    focusedRight: {},
    defaultValues: {},
    error: '',
};

export default TitleCreate;
