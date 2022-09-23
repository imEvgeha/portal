import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Restricted} from '@portal/portal-auth/permissions';
import {AutoComplete, Checkbox, Dropdown, InputText, Button} from '@portal/portal-components';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {NEXUS_ENTITY_TYPES} from '@vubiquity-nexus/portal-ui/src/elements/nexus-entity/constants';
import {getDomainName, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {isEmpty, isObject} from 'lodash';
import {Dialog} from 'primereact/dialog';
import {FormProvider, useForm, useWatch} from 'react-hook-form';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {rightsService} from '../../../legacy/containers/avail/service/RightsService';
import {publisherService} from '../../../legacy/containers/metadata/service/PublisherService';
import TitleConfigurationService from '../../services/TitleConfigurationService';
import TitleService from '../../services/TitleService';
import {storeTitleContentTypes} from '../../titleMetadataActions';
import {createContentTypesSelector} from '../../titleMetadataSelectors';
import ExternalIDsSection from '../nexus-field-extarnal-ids/ExternalIDsSection';
import constants, {CONTENT_TYPES, DEFAULT_VALUES_FOR_TITLE_CREATE_MODAL} from './TitleCreateModalConstants';
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
    contentTypes,
    selectedTenant,
    addToast,
    storeTitleContentTypes,
    externalDropdownOptions,
}) => {
    const titleConfigurationService = TitleConfigurationService.getInstance();
    const titleServiceSingleton = TitleService.getInstance();
    const {CREATE_TITLE_RESTRICTIONS, EXTERNAL_ID_TYPE_DUPLICATE_ERROR} = constants;
    const {MAX_TITLE_LENGTH, MAX_SEASON_LENGTH, MAX_EPISODE_LENGTH, MAX_RELEASE_YEAR_LENGTH} =
        CREATE_TITLE_RESTRICTIONS;
    const {id: focusedId} = focusedRight;
    const initialValues = {...defaultValues, ...DEFAULT_VALUES_FOR_TITLE_CREATE_MODAL, catalogueOwner: tenantCode};
    const form = useForm({
        defaultValues: initialValues,
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
    const currentContentType = currentValues.contentType;
    const routeParams = useParams();

    const isItMiniSeriesEpisode =
        currentValues?.contentType === CONTENT_TYPES.EPISODE &&
        currentValues?.contentSubtype === CONTENT_TYPES.MINI_SERIES;

    // filtering on series name
    const [filteredSeries, setFilteredSeries] = useState([]);
    const [contentSubTypes, setContentSubTypes] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [isCreatingTitle, setIsCreatingTitle] = useState(false);
    const [fetchingSeasons, setFetchingSeasons] = useState(false);
    const [isFieldRequired, setIsFieldRequired] = useState(false);

    useEffect(() => {
        if (!contentTypes.length) {
            titleConfigurationService.getEnums('content-type').then(resp => {
                resp.length ? storeTitleContentTypes(resp?.[0].values) : storeTitleContentTypes([]);
            });
        }
    }, [selectedTenant.id]);

    useEffect(() => {
        if (error) {
            addToast({
                severity: 'error',
                detail: error,
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
        const {contentType} = currentValues;
        if (!isEmpty(defaultValues)) {
            const keys = Object.keys(defaultValues);
            keys.forEach(key => {
                setValue(key, defaultValues[key]);
            });
        }

        if (contentType && contentTypes && !contentSubTypes) {
            getAndSetContentSubTypes(contentType);
        }
    }, [defaultValues]);

    useEffect(() => {
        const {contentType} = currentValues;
        if (contentType && contentTypes) {
            getAndSetContentSubTypes(contentType);
        }
    }, [currentValues.contentType]);

    const toggle = (isCancelClicked = false) => {
        !isCancelClicked && onSave();
        reset(initialValues);
        setValue('externalTitleIds', []);
        setFilteredSeries([]);
        setSeasons([]);
        setContentSubTypes([]);
    };

    const handleError = err => {
        setIsCreatingTitle(false);
        addToast({
            severity: 'error',
            detail: err?.message?.description,
        });
    };

    const handleIsFieldRequired = () => {
        const {contentType} = currentValues;
        switch (contentType) {
            case CONTENT_TYPES.SPORTS:
                return setIsFieldRequired(false);
            default:
                return setIsFieldRequired(true);
        }
    };

    const getAndSetContentSubTypes = contentType => {
        const currentContentTypeDetails = contentTypes.find(item => item.displayName === contentType);
        const currentContentSubTypeNames = currentContentTypeDetails?.values?.map(item => item.displayName);
        setValue('contentSubtype', currentContentTypeDetails?.values?.find(item => item.isDefault)?.displayName);
        setContentSubTypes(currentContentSubTypeNames);
        handleIsFieldRequired();
    };

    const isSeriesValid = () => {
        if (isObject(currentValues.seriesTitleName) || !areFieldsRequired() || isItMiniSeriesEpisode) {
            return true;
        }
        setError('seriesTitleName', {type: 'custom', message: 'Invalid series name'});
        return false;
    };

    const defaultCreateTitle = (title, params) => {
        titleServiceSingleton
            .create(title, params)
            .then(response => {
                if (currentValues.syncVZ || currentValues.syncMovida) {
                    // call registerTitle API
                    publisherService
                        .registerTitle(response?.meta?.id, currentValues.syncVZ, currentValues.syncMovida)
                        .then(response => {
                            addToast({
                                severity: 'success',
                                detail: constants.NEW_TITLE_TOAST_SUCCESS_PUBLISHING_MESSAGE,
                                content: () => (
                                    <Button
                                        label="View Title"
                                        className="p-button-link p-toast-button-link"
                                        onClick={() => onViewTitleClick(response, routeParams.realm)}
                                    />
                                ),
                            });
                        });
                }
                setIsCreatingTitle(false);
                addToast({
                    severity: 'success',
                    detail: constants.NEW_TITLE_TOAST_SUCCESS_MESSAGE,
                    content: () => (
                        <Button
                            label="View Title"
                            className="p-button-link p-toast-button-link"
                            onClick={() => onViewTitleClick(response, routeParams.realm)}
                        />
                    ),
                });
                toggle();
            })
            .catch(handleError);
    };

    const matchCreateTitle = (title, params) => {
        titleServiceSingleton
            .create(title, params)
            .then(res => {
                const titleId = res.meta.id;
                addToast({
                    severity: 'success',
                    detail: constants.NEW_TITLE_TOAST_SUCCESS_MESSAGE,
                    content: () => (
                        <Button
                            label="View Title"
                            className="p-button-link p-toast-button-link"
                            onClick={() => onViewTitleClick(res, routeParams.realm)}
                        />
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
                });
                return;
            }

            const title = getTitleWithoutEmptyField(submitTitle);
            const copyCastCrewFromSeason = Boolean(currentValues.addCrew);
            const getParentIdForParams = () => {
                const updatedParams = {};
                const {season, seriesTitleName, miniseriesTitleName} = submitTitle;
                if (season?.titleId || seriesTitleName?.titleId || miniseriesTitleName?.titleId) {
                    updatedParams.parentTitleId =
                        season?.titleId || seriesTitleName?.titleId || miniseriesTitleName?.titleId;
                }
                return updatedParams;
            };
            const params = {copyCastCrewFromSeason, ...getParentIdForParams()};
            setIsCreatingTitle(true);

            isItMatching ? matchCreateTitle(title, params) : defaultCreateTitle(title, params);
        }
    };

    /**
     * Get the response of the /search api and show it as filtered data
     * @param event Search string of the `Series` field
     */
    const searchSeries = async event => {
        setTimeout(async () => {
            let filteredSeries = [];
            const params = {};
            const getContentTypeName = displayName => contentTypes.find(item => item.displayName === displayName)?.name;
            params.titleName = event.query;
            params.contentType = getContentTypeName(
                isItMiniSeriesEpisode ? CONTENT_TYPES.MINI_SERIES : CONTENT_TYPES.SERIES
            );

            // only invoke the API when the search query string is not empty
            if (event.query.trim().length) {
                const response = await titleServiceSingleton.freeTextSearch({...params}, 0, 100);
                if (response?.titles?.length) {
                    filteredSeries = response?.titles;
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

            titleServiceSingleton
                .freeTextSearch({parentId: series.titleId, contentType: CONTENT_TYPES.SEASON}, 0, 100)
                .then(response => {
                    setSeasons(response.titles);
                    setFetchingSeasons(false);
                })
                .catch(() => {
                    setFetchingSeasons(false);
                });
        }
    };

    const toSeriesAndRelease = a => {
        return `${a?.titleName}${a?.releaseYear ? `, ${a?.releaseYear}` : ``}`;
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
     * @returns {`${string}`|`${*}${string}`}
     * @param title
     */

    const areThereAnyExternalSystemDuplicates = title => {
        const externalIdArray = title?.externalTitleIds?.map(item => item.externalId);
        const externalIdTypesArray = title?.externalTitleIds?.map(item => item.externalIdType);
        const findDuplicates = arr => arr && arr?.filter((item, index) => arr.indexOf(item) !== index);

        const indexOfDuplicateID = findDuplicates(externalIdArray)?.length;
        const indexOfDuplicateType = findDuplicates(externalIdTypesArray)?.length;

        return !!(indexOfDuplicateID && indexOfDuplicateType);
    };

    const getTitleWithoutEmptyField = titleForm => {
        const getValueOrEmptyObject = (key, value) => {
            if (value) {
                return {[key]: value};
            }
            return {};
        };

        const updatedExternalTitleIds = titleForm.externalTitleIds?.length ? titleForm.externalTitleIds : null;
        const seasonNumber = isObject(titleForm.season) ? titleForm.season.number : titleForm.season;
        const currentContentTypeDetails = contentTypes?.find(item => item.displayName === titleForm.contentType);
        const currentContentSubType = currentContentTypeDetails?.values?.find(
            item => item.displayName === titleForm.contentSubtype
        );
        return {
            name: titleForm.title,
            ...getValueOrEmptyObject('releaseYear', titleForm.releaseYear),
            ...getValueOrEmptyObject('contentType', currentContentTypeDetails.name),
            ...getValueOrEmptyObject('contentSubType', currentContentSubType.name),
            ...getValueOrEmptyObject('externalTitleIds', updatedExternalTitleIds),
            ...getValueOrEmptyObject('miniseries', titleForm.miniseriesTitleName?.title),
            ...getValueOrEmptyObject('seasonNumber', seasonNumber),
            ...getValueOrEmptyObject('episodeNumber', titleForm.episodeNumber),
        };
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
                        <Checkbox
                            formControlOptions={{
                                formControlName: `syncVZ`,
                            }}
                            checked={currentValues?.syncVZ}
                            id="syncVZ"
                            className="nexus-c-title-create_checkbox"
                            inputId="syncVZ"
                            labelProps={{
                                label: 'Publish to VZ and Movida Int`l',
                                shouldUpper: true,
                            }}
                            labelPosition="right"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col nexus-c-title-create_checkbox-wrapper">
                        <Checkbox
                            formControlOptions={{
                                formControlName: `syncMovida`,
                            }}
                            checked={currentValues?.syncMovida}
                            id="syncMovida"
                            className="nexus-c-title-create_checkbox"
                            inputId="syncMovida"
                            labelProps={{
                                label: 'Publish to Movida',
                                shouldUpper: true,
                            }}
                            labelPosition="right"
                        />
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
                        const isCancelClicked = true;
                        toggle(isCancelClicked);
                        onCloseModal();
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
        switch (currentContentType) {
            case CONTENT_TYPES.SEASON:
            case CONTENT_TYPES.EPISODE:
            case CONTENT_TYPES.SPORTS:
                return true;
            default:
                return false;
        }
    };
    const fieldsToDisplayAndHideForSeason = fieldsToDisplay() && currentContentType !== CONTENT_TYPES.SEASON;
    const isReleaseYearMandatory = currentContentType !== CONTENT_TYPES.SEASON;

    const areFieldsRequired = () => {
        switch (currentContentType) {
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
                                <div className="col-12 nexus-c-title-create_input-wrapper">
                                    <InputText
                                        formControlOptions={{
                                            formControlName: `title`,
                                            rules: {
                                                required: {value: true, message: 'Field cannot be empty!'},
                                                maxLength: {
                                                    value: MAX_TITLE_LENGTH,
                                                    message: `Max title length is ${MAX_TITLE_LENGTH}!`,
                                                },
                                            },
                                        }}
                                        labelProps={{label: 'Title', stacked: true, isRequired: true}}
                                        id="title"
                                        className="nexus-c-title-create_input"
                                        placeholder="Enter Title"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-6 col-sm-12">
                                    <Dropdown
                                        labelProps={{
                                            isRequired: true,
                                            label: 'Content Type',
                                            shouldUpper: true,
                                            stacked: true,
                                        }}
                                        formControlOptions={{
                                            formControlName: `contentType`,
                                            rules: {
                                                required: {value: true, message: 'Field cannot be empty!'},
                                            },
                                        }}
                                        options={contentTypes?.length ? contentTypes?.map(e => e.displayName) : []}
                                        disabled={isItMatching}
                                        id="contentType"
                                        className="nexus-c-title-create_input-dropdown"
                                        placeholder="Select a Content Type"
                                    />
                                </div>

                                <div className="col-lg-6 col-sm-12">
                                    <Dropdown
                                        labelProps={{
                                            isRequired: true,
                                            label: 'Content Subtype',
                                            shouldUpper: true,
                                            stacked: true,
                                        }}
                                        formControlOptions={{
                                            formControlName: `contentSubtype`,
                                            rules: {
                                                required: {value: true, message: 'Field cannot be empty!'},
                                            },
                                        }}
                                        value={currentValues.contentSubtype}
                                        options={contentSubTypes}
                                        id="contentSubtype"
                                        className="nexus-c-title-create_input-dropdown"
                                        placeholder="Select a Content Sub Type"
                                    />
                                </div>
                            </div>

                            {fieldsToDisplay() && !isItMiniSeriesEpisode ? (
                                <div className="row">
                                    <div className="col-lg-6 col-sm-12">
                                        <AutoComplete
                                            labelProps={{
                                                label: 'Series',
                                                stacked: true,
                                                isRequired: isFieldRequired,
                                            }}
                                            formControlOptions={{
                                                formControlName: `seriesTitleName`,
                                                rules: {
                                                    required: {
                                                        value: isFieldRequired,
                                                        message: 'Field cannot be empty!',
                                                    },
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
                                        {currentContentType === CONTENT_TYPES.SEASON ? (
                                            <InputText
                                                formControlOptions={{
                                                    formControlName: `season`,
                                                    rules: {
                                                        required: {value: true, message: 'Field cannot be empty!'},
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'Please enter a valid season!',
                                                        },
                                                        maxLength: {
                                                            value: MAX_SEASON_LENGTH,
                                                            message: `Max season length is ${MAX_SEASON_LENGTH}!`,
                                                        },
                                                    },
                                                }}
                                                labelProps={{label: 'Season', stacked: true, isRequired: true}}
                                                id="season"
                                                className="nexus-c-title-create_input"
                                                placeholder="Enter Season Number"
                                            />
                                        ) : (
                                            <Dropdown
                                                formControlOptions={{
                                                    formControlName: `season`,
                                                    rules: {
                                                        required: {
                                                            value: isFieldRequired,
                                                            message: 'Field cannot be empty!',
                                                        },
                                                    },
                                                }}
                                                labelProps={{
                                                    label: 'Season',
                                                    stacked: true,
                                                    isRequired: isFieldRequired,
                                                }}
                                                id="season"
                                                className="nexus-c-title-create_dropdown"
                                                options={seasons}
                                                optionLabel="number"
                                                columnClass="col-12"
                                                placeholder="Select Season Number"
                                                disabled={fetchingSeasons}
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : null}

                            {fieldsToDisplay() ? (
                                <div className="row">
                                    {isItMiniSeriesEpisode ? (
                                        <div className="col-lg-6 col-sm-12">
                                            <AutoComplete
                                                labelProps={{label: 'Miniseries', stacked: true, isRequired: true}}
                                                formControlOptions={{
                                                    formControlName: `miniseriesTitleName`,
                                                    rules: {
                                                        required: {value: true, message: 'Field cannot be empty!'},
                                                    },
                                                }}
                                                forceSelection
                                                id="miniseriesTitleName"
                                                field="newTitleReleaseYear"
                                                placeholder="Enter Title"
                                                value={currentValues.miniseriesTitleName}
                                                suggestions={filteredSeries}
                                                completeMethod={searchSeries}
                                                itemTemplate={seriesTemplate}
                                                columnClass="col-lg-12"
                                                aria-label="Series"
                                            />
                                        </div>
                                    ) : null}

                                    {fieldsToDisplay() ? (
                                        <div className="col-lg-6 col-sm-12">
                                            {fieldsToDisplayAndHideForSeason ? (
                                                <InputText
                                                    formControlOptions={{
                                                        formControlName: `episodeNumber`,
                                                        rules: {
                                                            required: {
                                                                value: isFieldRequired,
                                                                message: 'Field cannot be empty!',
                                                            },
                                                            pattern: {
                                                                value: /^[0-9]+$/,
                                                                message: 'Please enter a valid episode!',
                                                            },
                                                            maxLength: {
                                                                value: MAX_EPISODE_LENGTH,
                                                                message: `Max episode length is ${MAX_EPISODE_LENGTH}!`,
                                                            },
                                                        },
                                                    }}
                                                    labelProps={{
                                                        label: 'Episode',
                                                        stacked: true,
                                                        isRequired: isFieldRequired,
                                                    }}
                                                    id="episodeNumber"
                                                    className="nexus-c-title-create_input"
                                                    placeholder="Enter Episode Number"
                                                />
                                            ) : null}
                                        </div>
                                    ) : null}

                                    {fieldsToDisplayAndHideForSeason && !isItMiniSeriesEpisode ? (
                                        <div className="col-lg-6 col-sm-12 nexus-c-title-create_checkbox-wrapper d-flex align-items-center">
                                            <Checkbox
                                                formControlOptions={{
                                                    formControlName: `addCrew`,
                                                }}
                                                checked={currentValues?.addCrew}
                                                id="addCrew"
                                                className="nexus-c-title-create_checkbox"
                                                inputId="addCrew"
                                                labelProps={{
                                                    label: 'Add Cast Crew from Season to episode',
                                                    shouldUpper: false,
                                                }}
                                                labelPosition="right"
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}

                            <div className="row">
                                <div className="col-lg-6 col-sm-12">
                                    <InputText
                                        formControlOptions={{
                                            formControlName: `releaseYear`,
                                            rules: {
                                                required: {
                                                    value: isReleaseYearMandatory,
                                                    message: 'Field cannot be empty!',
                                                },
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
                                            },
                                        }}
                                        labelProps={{
                                            label: 'Release Year',
                                            stacked: true,
                                            isRequired: isReleaseYearMandatory,
                                        }}
                                        id="titleReleaseYear"
                                        className="nexus-c-title-create_input"
                                        placeholder="Enter Release Year"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    {externalDropdownOptions?.values && (
                                        <ExternalIDsSection
                                            control={control}
                                            register={register}
                                            errors={errors}
                                            externalDropdownOptions={externalDropdownOptions}
                                        />
                                    )}
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
    contentTypes: PropTypes.array,
    selectedTenant: PropTypes.object,
    addToast: PropTypes.func,
    storeTitleContentTypes: PropTypes.func,
    externalDropdownOptions: PropTypes.object,
};

TitleCreate.defaultProps = {
    tenantCode: undefined,
    isItMatching: false,
    bulkTitleMatch: () => null,
    focusedRight: {},
    defaultValues: {},
    error: '',
    contentTypes: [],
    selectedTenant: {},
    addToast: () => null,
    storeTitleContentTypes: () => null,
    externalDropdownOptions: {},
};

const mapStateToProps = () => {
    const contentTypesSelector = createContentTypesSelector();
    const selectedTenantSelector = state => state?.auth?.selectedTenant || {};

    return state => ({
        contentTypes: contentTypesSelector(state),
        selectedTenant: selectedTenantSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    addToast: payload => dispatch(addToast(payload)),
    storeTitleContentTypes: payload => dispatch(storeTitleContentTypes(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleCreate);
