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
import {isEmpty, isObject} from 'lodash';
import {Button} from 'primereact/button';
import {Checkbox} from 'primereact/checkbox';
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {FormProvider, useForm, useWatch} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import {store} from '../../../..';
import {rightsService} from '../../../legacy/containers/avail/service/RightsService';
import {publisherService} from '../../../legacy/containers/metadata/service/PublisherService';
import {titleService} from '../../../legacy/containers/metadata/service/TitleService';
import ExternalIDsSection from '../nexus-field-extarnal-ids/ExternalIDsSection';
import constants, {CONTENT_TYPE_ITEMS, CONTENT_TYPES} from './TitleCreateModalConstants';
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
    const {CREATE_TITLE_RESTRICTIONS, EXTERNAL_ID_TYPE_DUPLICATE_ERROR} = constants;
    const {MAX_TITLE_LENGTH, MAX_SEASON_LENGTH, MAX_EPISODE_LENGTH, MAX_RELEASE_YEAR_LENGTH} =
        CREATE_TITLE_RESTRICTIONS;
    const addToast = toast => store.dispatch(toastDisplay(toast));
    const {id: focusedId} = focusedRight;
    const [isCreatingTitle, setIsCreatingTitle] = useState(false);
    const form = useForm({
        defaultValues: {...defaultValues, catalogueOwner: tenantCode},
        mode: 'all',
        reValidateMode: 'onChange',
    });
    const {
        register,
        control,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: {errors, isValid},
    } = form;
    const currentValues = useWatch({control});
    const routeParams = useParams();

    // filtering on series name
    const [filteredSeries, setFilteredSeries] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [fetchingSeasons, setFetchingSeasons] = useState(false);

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
        if (currentValues.seriesTitleName === '') {
            setSeasons([]);
        }
    }, [currentValues.seriesTitleName]);

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
        setValue('externalSystemIds', []);
        setFilteredSeries([]);
        setSeasons([]);
    };

    const handleError = err => {
        setIsCreatingTitle(false);
        addToast({
            severity: 'error',
            detail: err.message.description,
            sticky: true,
        });
    };

    const isSeriesValid = () => {
        if (isObject(currentValues.seriesTitleName) || !areFieldsRequired()) {
            return true;
        }
        setError('seriesTitleName', {type: 'custom', message: 'Invalid series name'});
        return false;
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
                const titleId = res.meta.id;
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
                            titleId,
                        },
                    });
                } else if (bulkTitleMatch) {
                    bulkTitleMatch(titleId, true);
                } else {
                    const updatedRight = {coreTitleId: titleId};
                    rightsService.update(updatedRight, focusedId);
                }
                setIsCreatingTitle(false);
                toggle();
            })
            .catch(handleError);
    };

    const onSubmit = submitTitle => {
        if (!isSeriesValid()) {
            return;
        }

        // trigger the POST API only if the form is valid
        if (isValid) {
            if (areThereAnyExternalSystemDuplicates(submitTitle)) {
                addToast({
                    severity: 'error',
                    detail: EXTERNAL_ID_TYPE_DUPLICATE_ERROR,
                    sticky: true,
                });
                return;
            }

            const title = getTitleWithoutEmptyField(submitTitle);
            const copyCastCrewFromSeason = Boolean(currentValues.addCrew);
            const params = {copyCastCrewFromSeason};
            setIsCreatingTitle(true);

            isItMatching ? matchCreateTitle(title) : defaultCreateTitle(title, params);
        }
    };

    /**
     * Get the response of the /search api and show it as filtered data
     * @param event Search string of the `Series` field
     */
    const searchSeries = async event => {
        setTimeout(async () => {
            let filteredSeries = [];
            // only invoke the API when the search query string is not empty
            if (event.query.trim().length) {
                const response = await titleService.freeTextSearch(
                    {title: event.query, contentType: CONTENT_TYPES.SERIES, tenantCode},
                    0,
                    100
                );
                if (response?.total > 0) {
                    filteredSeries = response?.data;
                } else {
                    filteredSeries = [];
                }
            }
            const newFilteredSeries = filteredSeries.map(s => ({
                newTitleReleaseYear: toSeriesAndRelease(s),
                ...s,
            }));
            setFilteredSeries(newFilteredSeries);
        }, 500);
    };

    /**
     * Returns the seasons of the selected series
     * @param series series object param to fetch the seasons
     */
    const fetchSeasonsForSelectedSeries = series => {
        if (series) {
            setFetchingSeasons(true);
            setSeasons([]);

            titleService
                .freeTextSearch(
                    {parentId: series.id, contentType: CONTENT_TYPES.SEASON, tenantCode, sort: 'seasonNumber'},
                    0,
                    100
                )
                .then(response => {
                    setSeasons(
                        // map the properties needed for the dropdown
                        response?.data?.map(season => {
                            return {
                                ...season.episodic,
                            };
                        })
                    );
                    setFetchingSeasons(false);
                })
                .catch(() => {
                    setFetchingSeasons(false);
                });
        }
    };

    const toSeriesAndRelease = a => {
        return `${a?.episodic?.seriesTitleName}${a?.releaseYear ? `, ${a?.releaseYear}` : ``}`;
    };

    /**
     * Template used for the list options of the `Series` AutoComplete component
     * @param seriesItem The found series object
     * @returns {JSX.Element} Returns a JSX.Element to be rendered as an option
     */
    const seriesTemplate = seriesItem => {
        return <div className="series-item">{seriesItem.newTitleReleaseYear}</div>;
    };

    /**
     * Selected Item template for `Series` AutoComplete.
     * A concatination of series name and series year(if exists)
     * @param seriesItem The selected series from the results found
     * @returns {`${string}`|`${*}${string}`}
     */

    const areThereAnyExternalSystemDuplicates = title => {
        const externalIdTypesArray = title?.externalSystemIds?.map(item => item.externalSystem);
        const indexOfDuplicate = externalIdTypesArray.findIndex(
            (item, index) => externalIdTypesArray.indexOf(item) !== index
        );

        return indexOfDuplicate >= 0;
    };

    const getTitleWithoutEmptyField = titleForm => {
        const updatedExternalSystemIds = titleForm.externalSystemIds.length ? titleForm.externalSystemIds : null;
        const tempTitle = {
            name: titleForm.title,
            releaseYear: titleForm.releaseYear || null,
            contentType: titleForm.contentType.toLowerCase(),
            externalSystemIds: updatedExternalSystemIds,
            contentSubType: titleForm.contentType.toLowerCase(),
        };
        // in case of season/episode/sports, adding more properties to payload
        // this can not be simplified as payload accept parentId in season and parentId(s) in episode
        if (fieldsToDisplay()) {
            // if adding a new season
            if (currentValues.contentType === CONTENT_TYPES.SEASON) {
                tempTitle.parentId = {
                    contentType:
                        titleForm.contentType.toLowerCase() === 'season'
                            ? titleForm.seriesTitleName.contentType.toLowerCase() === 'series'
                                ? CONTENT_TYPES.SERIES
                                : ''
                            : '',
                    id: currentValues.seriesTitleName?.id,
                };
                tempTitle.seasonNumber = titleForm.seasonNumber || null;
            }
            // if adding a new episode, add property parentId(s)
            else if (currentValues.contentType === 'EPISODE') {
                tempTitle.parentIds = [
                    {
                        contentType: 'series',
                        id: currentValues.seriesTitleName?.id,
                    },
                    {
                        contentType: 'season',
                        id: currentValues.seasonNumber.seasonId,
                    },
                ];
                tempTitle.episodeNumber = currentValues.episodeNumber;
            }
        }
        return tempTitle;
    };

    const renderSyncCheckBoxes = () => (
        <Restricted resource="publishTitleMetadata">
            <div className="nexus-c-title-create_checkbox-container">
                <div className="row nexus-c-create-title-publish-header">
                    <div className="col-12">
                        <NexusEntity type={NEXUS_ENTITY_TYPES.subsection} heading="PUBLISH" />
                    </div>
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
                        toggle();
                    }}
                    disabled={isCreatingTitle}
                    className="p-button-outlined p-button-secondary"
                />
                <Button
                    id="titleSaveBtn"
                    label={isItMatching ? 'Match & Create' : 'Save'}
                    onClick={async e => {
                        await handleSubmit(onSubmit)(e);
                        isSeriesValid();
                    }}
                    loading={isCreatingTitle}
                    loadingIcon="pi pi-spin pi-spinner"
                    className="p-button-outlined"
                    iconPos="right"
                />
            </div>
        </div>
    );

    const fieldsToDisplay = () => {
        switch (currentValues.contentType) {
            case CONTENT_TYPES.SEASON:
            case CONTENT_TYPES.EPISODE:
            case CONTENT_TYPES.EVENT:
            case CONTENT_TYPES.SPORTS:
                return true;
            default:
                return false;
        }
    };
    const fieldsToDisplayAndHideForSeason = fieldsToDisplay() && currentValues.contentType !== CONTENT_TYPES.SEASON;

    const areFieldsRequired = () => {
        switch (currentValues.contentType) {
            case CONTENT_TYPES.SEASON:
            case CONTENT_TYPES.EPISODE:
                return true;
            case CONTENT_TYPES.SPORTS:
                return false;
            default:
                return false;
        }
    };

    return (
        <Dialog
            header="Create Title"
            visible={display}
            style={{width: '50vw'}}
            footer={renderFooter()}
            onHide={toggle}
            className="nexus-c-title-create_dialog"
            closeOnEscape={false}
            closable={false}
        >
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-12">
                            <div className="row nexus-c-create-title-overview-header">
                                <div className="col-12">
                                    <NexusEntity type={NEXUS_ENTITY_TYPES.subsection} heading="OVERVIEW" />
                                </div>
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
                                        <AutoComplete
                                            labelProps={{label: 'Series', stacked: true, isRequired: true}}
                                            formControlOptions={{
                                                formControlName: `seriesTitleName`,
                                                rules: {
                                                    required: {value: true, message: 'Field cannot be empty!'},
                                                },
                                            }}
                                            forceSelection
                                            id="seriesTitleName"
                                            field="newTitleReleaseYear"
                                            placeholder="Enter Series Name"
                                            value={currentValues.seriesTitleName}
                                            suggestions={filteredSeries}
                                            completeMethod={searchSeries}
                                            itemTemplate={seriesTemplate}
                                            columnClass="col-lg-12"
                                            onSelect={e => {
                                                e.originalEvent.type !== 'blur' &&
                                                    fetchSeasonsForSelectedSeries(e.value);
                                            }}
                                            aria-label="Series"
                                        />
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
                                            {currentValues.contentType === CONTENT_TYPES.SEASON ? (
                                                <InputText
                                                    placeholder="Enter Season Number"
                                                    id="seasonNumber"
                                                    className="nexus-c-title-create_input"
                                                />
                                            ) : (
                                                <Dropdown
                                                    key="seasonNumber-dropdown"
                                                    id="seasonNumber"
                                                    className="nexus-c-title-create_dropdown"
                                                    options={seasons}
                                                    optionLabel="seasonNumber"
                                                    columnClass="col-12"
                                                    placeholder="Select Season Number"
                                                    disabled={fetchingSeasons}
                                                />
                                            )}
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
                                    {fieldsToDisplayAndHideForSeason ? (
                                        <div className="col-lg-6 col-sm-12 nexus-c-title-create_checkbox-wrapper d-flex align-items-center">
                                            <ControllerWrapper
                                                title="Add Cast Crew from Season to episode"
                                                inputName="addCrew"
                                                errors={errors.addCrew}
                                                control={control}
                                                register={register}
                                                labelClassName="nexus-c-title-create_checkbox-label"
                                                childWrapperClassName="nexus-c-title-checkbox-wrapper"
                                                isItCheckbox
                                            >
                                                <Checkbox
                                                    id="addCrew"
                                                    className="nexus-c-title-create_checkbox"
                                                    inputId="addCrew"
                                                />
                                            </ControllerWrapper>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}

                            <div className="row">
                                <div className="col-lg-6 col-sm-12">
                                    <ControllerWrapper
                                        title="Release Year"
                                        inputName="releaseYear"
                                        errors={errors.releaseYear}
                                        required={currentValues.contentType !== CONTENT_TYPES.SEASON}
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
                            <div className="row">
                                <div className="col-12">
                                    <ExternalIDsSection control={control} register={register} errors={errors} />
                                </div>
                            </div>
                            {isItMatching ? null : renderSyncCheckBoxes()}
                        </div>
                    </div>
                </form>
            </FormProvider>
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
