import React, {useState} from 'react';
import {SUCCESS_TITLE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {Alert, FormGroup, Label} from 'reactstrap';
import {Button} from 'primereact/button';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import './Title.scss';
import {titleService} from '../../../service/TitleService';
import {publisherService} from '../../../service/PublisherService';
import {
    ADVERTISEMENT,
    EPISODE,
    EVENT,
    MOVIE,
    SEASON,
    SERIES,
    SPECIAL,
    SPORTS,
} from '../../../../../../metadata/constants/contentType';
import constants from './TitleCreateModalConstants';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import titleConstants from '../../../../../../avails/title-matching/components/create-title-form/CreateTitleFormConstants';
import {URL, getDomainName} from '@vubiquity-nexus/portal-utils/lib/Common';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {addToast as toastDisplay} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {useForm, Controller} from 'react-hook-form';
import {InputText} from 'primereact/inputtext';
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import {store} from '../../../../../../..';
import {rightsService} from '../../../../avail/service/RightsService';

const onViewTitleClick = response => {
    const {id} = response || {};
    const url = `${getDomainName()}/metadata/detail/${id}`;
    window.open(url, '_blank');
};

const TitleCreate = ({onToggle, tenantCode, display, isItMatching}) => {
    const {MAX_TITLE_LENGTH, MAX_SEASON_LENGTH, MAX_EPISODE_LENGTH, MAX_RELEASE_YEAR_LENGTH} = constants;
    const addToast = toast => store.dispatch(toastDisplay(toast));

    const [errorMessage, setErrorMessage] = useState('');
    const [seasonChecked, setSeasonChecked] = useState(true);
    const [episodeChecked, setEpisodeChecked] = useState(true);
    const [seriesChecked, setSeriesChecked] = useState(true);
    const [isSeriesCompleted, setIsSeriesCompleted] = useState(false);
    const [isReleaseYearRequired, setIsReleaseYearRequired] = useState(true);
    const [isSeasonNumberRequired, setIsSeasonNumberRequired] = useState(false);
    const [isEpisodeNumberRequired, setIsEpisodeNumberRequired] = useState(false);
    const [isSyncVZ, setIsSyncVZ] = useState(false);
    const [isCreatingTitle, setIsCreatingTitle] = useState(false);
    const [copyCastCrewFromSeason, setCopyCastCrewFromSeason] = useState(false);
    const [isSyncMovida, setIsSyncMovida] = useState(false);
    const [titleForm, setTitleForm] = useState({
        title: '',
        contentType: '',
        releaseYear: '',
        episodic: {
            seriesTitleName: '',
            episodeNumber: '',
            seasonNumber: '',
        },
    });

    const contentTypeItems = [
        {label: 'Select Content Type', value: ''},
        {label: MOVIE.name, value: MOVIE.apiName},
        {label: SERIES.name, value: SERIES.apiName},
        {label: SEASON.name, value: SEASON.apiName},
        {label: EPISODE.name, value: EPISODE.apiName},
        {label: EVENT.name, value: EVENT.apiName},
        {label: SPORTS.name, value: SPORTS.apiName},
        {label: ADVERTISEMENT.name, value: ADVERTISEMENT.apiName},
        {label: SPECIAL.name, value: SPECIAL.apiName},
    ];

    const tenantCodeItems = [
        {
            label: tenantCode === 'vu' ? 'Vubiquity' : 'MGM',
            value: tenantCode,
        },
    ];

    const toggle = () => {
        cleanFields();
        onToggle();
        setErrorMessage('');
        setSeasonChecked(true);
        setEpisodeChecked(true);
        setSeriesChecked(true);
        setIsSeriesCompleted(false);
        setIsReleaseYearRequired(true);
    };

    const handleChange = e => {
        setTitleForm({
            ...titleForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeEpisodic = e => {
        const newEpisodic = {
            ...titleForm.episodic,
            [e.target.name]: e.target.value,
        };

        setTitleForm({
            ...titleForm,
            episodic: newEpisodic,
        });

        if (e.target.value.length !== 0) {
            setIsSeriesCompleted(true);
            setIsSeasonNumberRequired(true);
        } else {
            setIsSeriesCompleted(false);
            setIsSeasonNumberRequired(false);
        }
    };

    const handleChangeSeasonNumber = e => {
        const newEpisodic = {
            ...titleForm.episodic,
            seasonNumber: e.target.value,
        };

        setTitleForm({
            ...titleForm,
            episodic: newEpisodic,
        });

        if (e.value?.length !== 0) {
            setIsSeriesCompleted(true);
            setIsEpisodeNumberRequired(true);
        } else {
            setIsSeriesCompleted(false);
            setIsEpisodeNumberRequired(false);
        }
    };

    const defaultCreateTitle = (title, params) => {
        titleService
            .createTitle(title, params)
            .then(response => {
                if (isSyncVZ || isSyncMovida) {
                    // call registerTitle API
                    publisherService
                        .registerTitle(response.id, isSyncVZ, isSyncMovida)
                        .then(response => {
                            addToast({
                                severity: 'success',
                                content: () => {
                                    return (
                                        <ToastBody
                                            summary={SUCCESS_TITLE}
                                            detail={titleConstants.NEW_TITLE_TOAST_SUCCESS_PUBLISHING_MESSAGE}
                                            severity="success"
                                        >
                                            <Button
                                                label="View Title"
                                                className="p-button-link p-toast-button-link"
                                                onClick={() => onViewTitleClick(response)}
                                            />
                                        </ToastBody>
                                    );
                                },
                            });
                        })
                        .catch(() => {
                            setIsCreatingTitle(false);
                            setErrorMessage(
                                get(
                                    e,
                                    'response.data.description',
                                    titleConstants.NEW_TITLE_TOAST_ERROR_PUBLISHING_MESSAGE
                                )
                            );
                        });
                }
                setIsCreatingTitle(false);
                cleanFields();
                toggle();
                addToast({
                    severity: 'success',
                    content: () => {
                        return (
                            <ToastBody
                                summary={SUCCESS_TITLE}
                                detail={titleConstants.NEW_TITLE_TOAST_SUCCESS_MESSAGE}
                                severity="success"
                            >
                                <Button
                                    label="View Title"
                                    className="p-button-link p-toast-button-link"
                                    onClick={() => onViewTitleClick(response)}
                                />
                            </ToastBody>
                        );
                    },
                });
            })
            .catch(e => {
                setIsCreatingTitle(false);
                setErrorMessage(get(e, 'response.data.description', 'Title creation failed!'));
            });
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
                            <PrimeReactButton
                                label="View Title"
                                className="p-button-link p-toast-button-link"
                                onClick={() => onViewTitleClick(titleId)}
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
                cleanFields();
                toggle();
            })
            .catch(error => {
                setIsCreatingTitle(false);
                setErrorMessage(get(error, 'response.data.description', 'Title creation failed!'));
            });
    };

    const onSubmit = () => {
        setErrorMessage('');
        const title = getTitleWithoutEmptyField();
        const params = {tenantCode: tenantCode, copyCastCrewFromSeason};
        setIsCreatingTitle(true);

        isItMatching ? matchCreateTitle(title) : defaultCreateTitle(title, params);
    };

    const getTitleWithoutEmptyField = () => {
        const title = {};
        for (const titleField in titleForm) {
            if (titleField === 'episodic') {
                title[titleField] = getEpisodicWithoutEmptyFields();
            } else if (titleForm[titleField]) {
                title[titleField] = titleForm[titleField];
            } else {
                title[titleField] = null;
            }
        }

        return title;
    };

    const getEpisodicWithoutEmptyFields = () => {
        const episodic = {};
        let doAddEpisodic = false;
        for (const episodicField in titleForm.episodic) {
            if (titleForm.episodic[episodicField]) {
                episodic[episodicField] = titleForm.episodic[episodicField];
                doAddEpisodic = true;
            } else {
                episodic[episodicField] = null;
            }
        }

        return doAddEpisodic ? episodic : null;
    };

    const cleanFields = () => {
        setDefaultValues();
        setErrorMessage('');
        setSeasonChecked(true);
        setEpisodeChecked(true);
        setSeriesChecked(true);
        setIsSeriesCompleted(false);
        setIsReleaseYearRequired(true);
        setIsEpisodeNumberRequired(false);
        setIsSyncVZ(false);
        setIsSyncMovida(false);
        setCopyCastCrewFromSeason(false);
        setTitleForm({
            title: '',
            contentType: '',
            releaseYear: '',
            episodic: {
                seriesTitleName: '',
                episodeNumber: '',
                seasonNumber: '',
            },
        });
    };

    const handleChangeSeries = e => {
        const newEpisodic = {
            ...titleForm.episodic,
            seriesTitleName: e.target.value,
        };

        setTitleForm({
            ...titleForm,
            episodic: newEpisodic,
        });

        if (e.target.value.length !== 0) {
            setIsSeasonNumberRequired(true);
            setIsEpisodeNumberRequired(true);
        } else {
            setIsSeasonNumberRequired(false);
            setIsEpisodeNumberRequired(false);
        }
    };

    const handleSelect = e => {
        if (e.target.value === SEASON.apiName) {
            setSeasonChecked(false);
            setEpisodeChecked(true);
            setSeriesChecked(false);
            setIsReleaseYearRequired(true);
            setIsSeriesCompleted(true);
            setIsSeasonNumberRequired(true);
            setCopyCastCrewFromSeason(false);
            setTitleForm({
                ...titleForm,
                contentType: e.target.value,
                episodic: {
                    ...titleForm.episodic,
                    episodeNumber: '',
                },
            });
        } else if (e.target.value === EPISODE.apiName) {
            setSeasonChecked(false);
            setEpisodeChecked(false);
            setSeriesChecked(false);
            setIsReleaseYearRequired(true);
            setIsSeriesCompleted(true);
            setIsEpisodeNumberRequired(true);
            setIsSeasonNumberRequired(true);
            setTitleForm({
                ...titleForm,
                contentType: e.target.value,
            });
        } else if (e.target.value === SERIES.apiName) {
            setSeasonChecked(true);
            setEpisodeChecked(true);
            setSeriesChecked(true);
            setIsReleaseYearRequired(false);
            setCopyCastCrewFromSeason(false);
            setTitleForm({
                ...titleForm,
                contentType: e.target.value,
                episodic: {
                    ...titleForm.episodic,
                    seasonNumber: '',
                    episodeNumber: '',
                },
            });
        } else if (e.target.value === EVENT.apiName || e.target.value === SPORTS.apiName) {
            setSeasonChecked(false);
            setEpisodeChecked(false);
            setIsSeriesCompleted(false);
            setSeriesChecked(false);
            setIsReleaseYearRequired(true);
            setCopyCastCrewFromSeason(false);
            setIsEpisodeNumberRequired(false);
            setIsSeasonNumberRequired(false);
            setTitleForm({
                ...titleForm,
                contentType: e.target.value,
            });
        } else {
            setSeasonChecked(true);
            setEpisodeChecked(true);
            setSeriesChecked(true);
            setIsReleaseYearRequired(true);
            setCopyCastCrewFromSeason(false);
            setIsSeriesCompleted(true);
            setTitleForm({
                ...titleForm,
                contentType: e.target.value,
                episodic: {
                    seriesTitleName: '',
                    episodeNumber: '',
                    seasonNumber: '',
                },
            });
        }
    };

    const renderSyncCheckBoxes = () => (
        <div className="nexus-c-title-create_checkbox-container">
            <div className="row">
                <div className="col">
                    <Checkbox id="syncVZ" inputId="syncVZ" checked={isSyncVZ} onChange={e => setIsSyncVZ(e.checked)} />
                    <label className="nexus-c-title-create_checkbox-label" htmlFor="syncVZ">
                        Publish to VZ and Movida Int'l
                    </label>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Checkbox
                        id="syncMovida"
                        inputId="syncMovida"
                        checked={isSyncMovida}
                        onChange={e => setIsSyncMovida(e.checked)}
                    />
                    <label className="nexus-c-title-create_checkbox-label" htmlFor="syncVZ">
                        Publish to Movida
                    </label>
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
                    onClick={toggle}
                    appearance="primary"
                    disabled={isCreatingTitle}
                    className="p-button-text"
                />
                <Button
                    id="titleSaveBtn"
                    label={isItMatching ? 'Match & Create' : 'Save'}
                    onClick={handleSubmit(onSubmit)}
                    appearance="primary"
                    loading={isCreatingTitle}
                    loadingIcon="pi pi-spin pi-spinner"
                    className="p-button-text"
                    iconPos="right"
                />
            </div>
        </div>
    );

    const renderErrorMsg = error => {
        if (error) {
            return <span className="nexus-c-title-create_error-msg">{error.message}</span>;
        }

        return null;
    };

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm({
        defaultValues: {
            catalogueOwner: tenantCode,
        },
    });

    const setDefaultValues = () => {
        setValue('title', '');
        setValue('contentType', '');
        setValue('titleSeriesName', '');
        setValue('seasonNumber', '');
        setValue('episodeNumber', '');
        setValue('releaseYear', '');
    };

    return (
        <Dialog
            header="Create Title"
            visible={display}
            style={{width: '40vw'}}
            footer={renderFooter()}
            onHide={toggle}
            className="nexus-c-title-create_dialog"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <Label for="title">
                                    Title<span style={{color: 'red'}}>*</span>
                                </Label>
                                <div className="nexus-c-title-create_input-container">
                                    <Controller
                                        name="title"
                                        control={control}
                                        {...register('title', {
                                            required: 'Field cannot be empty!',
                                            maxLength: {
                                                value: MAX_TITLE_LENGTH,
                                                message: `Max title length is ${MAX_TITLE_LENGTH}!`,
                                            },
                                        })}
                                        render={({field}) => (
                                            <InputText
                                                placeholder="Enter Title"
                                                value={titleForm.title}
                                                id="title"
                                                className="nexus-c-title-create_input"
                                                {...field}
                                                onChange={e => {
                                                    handleChange(e);
                                                    field.onChange(e);
                                                }}
                                            />
                                        )}
                                    />
                                    {renderErrorMsg(errors.title)}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <Label for="contentType">
                                    Content Type<span style={{color: 'red'}}>*</span>
                                </Label>
                                <div className="nexus-c-title-create_input-container">
                                    <Controller
                                        name="contentType"
                                        control={control}
                                        {...register('contentType', {
                                            required: 'Field cannot be empty!',
                                        })}
                                        render={({field}) => (
                                            <Dropdown
                                                optionLabel="label"
                                                value={titleForm.contentType}
                                                options={contentTypeItems}
                                                id="contentType"
                                                className="nexus-c-title-create_input"
                                                placeholder="Select a Content Type"
                                                {...field}
                                                onChange={e => {
                                                    handleSelect(e);
                                                    field.onChange(e);
                                                }}
                                            />
                                        )}
                                    />
                                    {renderErrorMsg(errors.contentType)}
                                </div>
                            </div>
                        </div>

                        {!seriesChecked ? (
                            <div className="row">
                                <div className="col">
                                    <Label for="titleSeriesName">
                                        Series
                                        {isSeriesCompleted ? <span style={{color: 'red'}}>*</span> : null}
                                    </Label>
                                    <div className="nexus-c-title-create_input-container">
                                        <Controller
                                            name="titleSeriesName"
                                            control={control}
                                            {...register('titleSeriesName', {
                                                required: {
                                                    value: isSeriesCompleted,
                                                    message: 'Field cannot be empty!',
                                                },
                                            })}
                                            render={({field}) => (
                                                <InputText
                                                    placeholder="Enter Series Name"
                                                    id="titleSeriesName"
                                                    className="nexus-c-title-create_input"
                                                    disabled={seriesChecked}
                                                    value={titleForm.episodic.seriesTitleName}
                                                    {...field}
                                                    onChange={e => {
                                                        handleChangeSeries(e);
                                                        field.onChange(e);
                                                    }}
                                                />
                                            )}
                                        />
                                        {renderErrorMsg(errors.titleSeriesName)}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {!seasonChecked ? (
                            <div className="row">
                                <div className="col">
                                    <FormGroup>
                                        <Label for="titleSeasonNumber">
                                            Season
                                            {isSeasonNumberRequired ? <span style={{color: 'red'}}>*</span> : null}
                                        </Label>
                                        <div className="nexus-c-title-create_input-container">
                                            <Controller
                                                name="seasonNumber"
                                                control={control}
                                                {...register('seasonNumber', {
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Please enter a valid season!',
                                                    },
                                                    required: {
                                                        value: isSeasonNumberRequired,
                                                        message: 'Field cannot be empty!',
                                                    },
                                                    maxLength: {
                                                        value: MAX_SEASON_LENGTH,
                                                        message: `Max season length is ${MAX_SEASON_LENGTH}!`,
                                                    },
                                                })}
                                                render={({field}) => (
                                                    <InputText
                                                        placeholder="Enter Season Number"
                                                        id="titleSeasonNumber"
                                                        className="nexus-c-title-create_input"
                                                        disabled={seasonChecked}
                                                        value={titleForm.episodic.seasonNumber}
                                                        {...field}
                                                        onChange={e => {
                                                            handleChangeSeasonNumber(e);
                                                            field.onChange(e);
                                                        }}
                                                    />
                                                )}
                                            />
                                            {renderErrorMsg(errors.seasonNumber)}
                                        </div>
                                    </FormGroup>
                                </div>
                                {!episodeChecked ? (
                                    <div className="col">
                                        <FormGroup>
                                            <Label for="titleEpisodeNumber">
                                                Episode
                                                {isEpisodeNumberRequired ? <span style={{color: 'red'}}>*</span> : null}
                                            </Label>
                                            <div className="nexus-c-title-create_input-container">
                                                <Controller
                                                    name="episodeNumber"
                                                    control={control}
                                                    {...register('episodeNumber', {
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'Please enter a valid episode!',
                                                        },
                                                        required: {
                                                            value: isEpisodeNumberRequired,
                                                            message: 'Field cannot be empty!',
                                                        },
                                                        maxLength: {
                                                            value: MAX_EPISODE_LENGTH,
                                                            message: `Max season length is ${MAX_EPISODE_LENGTH}!`,
                                                        },
                                                    })}
                                                    render={({field}) => (
                                                        <InputText
                                                            placeholder="Enter Episode Number"
                                                            id="titleEpisodeNumber"
                                                            className="nexus-c-title-create_input"
                                                            disabled={episodeChecked}
                                                            value={titleForm.episodic.episodeNumber}
                                                            {...field}
                                                            onChange={e => {
                                                                handleChangeEpisodic(e);
                                                                field.onChange(e);
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {renderErrorMsg(errors.episodeNumber)}
                                            </div>
                                        </FormGroup>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        {!episodeChecked ? (
                            <div className="row">
                                <div className="col">
                                    <Checkbox
                                        id="addCrew"
                                        className="nexus-c-title-create_input"
                                        inputId="addCrew"
                                        checked={copyCastCrewFromSeason}
                                        onChange={e => setCopyCastCrewFromSeason(e.checked)}
                                    />
                                    <label className="nexus-c-title-create_checkbox-label" htmlFor="addCrew">
                                        Add Cast Crew from Season to episode
                                    </label>
                                </div>
                            </div>
                        ) : null}

                        <div className="row" style={{marginTop: '15px'}}>
                            <div className="col">
                                <Label for="releaseYear">
                                    Release Year
                                    {!isReleaseYearRequired ? null : <span style={{color: 'red'}}>*</span>}
                                </Label>
                                <div className="nexus-c-title-create_input-container">
                                    <Controller
                                        name="releaseYear"
                                        control={control}
                                        {...register('releaseYear', {
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Please enter a valid year!',
                                            },
                                            required: {
                                                value: isReleaseYearRequired,
                                                message: 'Field cannot be empty!',
                                            },
                                            maxLength: {
                                                value: MAX_RELEASE_YEAR_LENGTH,
                                                message: `Max release year length is ${MAX_RELEASE_YEAR_LENGTH}!`,
                                            },
                                            minLength: {
                                                value: MAX_RELEASE_YEAR_LENGTH,
                                                message: `Min release year length is ${MAX_RELEASE_YEAR_LENGTH}!`,
                                            },
                                        })}
                                        render={({field}) => (
                                            <InputText
                                                placeholder="Enter Release Year"
                                                id="titleReleaseYear"
                                                className="nexus-c-title-create_input"
                                                value={titleForm.releaseYear}
                                                {...field}
                                                onChange={e => {
                                                    handleChange(e);
                                                    field.onChange(e);
                                                }}
                                            />
                                        )}
                                    />
                                    {renderErrorMsg(errors.releaseYear)}
                                </div>
                            </div>
                        </div>

                        {tenantCode && !isItMatching && (
                            <div className="row">
                                <div className="col">
                                    <Label for="catalogueOwner">
                                        Catalogue Owner<span style={{color: 'red'}}>*</span>
                                    </Label>
                                    <div
                                        className="
                                        nexus-c-title-create_input-container
                                        nexus-c-title-create_catalogue-owner-dropdown-container
                                    "
                                    >
                                        <Controller
                                            name="catalogueOwner"
                                            control={control}
                                            {...register('catalogueOwner', {
                                                required: 'Field cannot be empty!',
                                            })}
                                            render={({field}) => (
                                                <Dropdown
                                                    optionLabel="label"
                                                    disabled
                                                    value={tenantCode}
                                                    options={tenantCodeItems}
                                                    id="catalogueOwner"
                                                    className="nexus-c-title-create_input"
                                                    placeholder="Select a Catalogue Owner"
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {renderErrorMsg(errors.catalogueOwner)}
                                    </div>
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
    onToggle: PropTypes.func.isRequired,
    display: PropTypes.bool.isRequired,
    tenantCode: PropTypes.string,
    addToast: PropTypes.func,
    isItMatching: PropTypes.bool,
};

TitleCreate.defaultProps = {
    tenantCode: undefined,
    addToast: () => null,
    isItMatching: false,
};

export default TitleCreate;
