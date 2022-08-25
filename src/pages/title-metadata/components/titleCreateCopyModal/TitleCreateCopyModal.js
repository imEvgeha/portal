import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, InputText} from '@portal/portal-components';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import {NEXUS_ENTITY_TYPES} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/constants';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {FormProvider, useForm, useWatch} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import TitleEditorialService from '../../services/TitleEditorialService';
import TitleService from '../../services/TitleService';
import {formatEditorialBody, onViewTitleClick} from '../../utils';
import ExternalIDsSection from '../nexus-field-extarnal-ids/ExternalIDsSection';
import constants from '../titleCreateModal/TitleCreateModalConstants';
import './TitleCreateCopyModal.scss';

const arrayDeletedEmetKeys = ['createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'hasGeneratedChildren', 'type', 'id'];
const titleServiceSingleton = TitleService.getInstance();
const titleEditorialService = TitleEditorialService.getInstance();

const TitleCreateCopyModal = ({title, display, handleCloseModal, externalIdOptions, editorialMetadata}) => {
    const initialValues = {
        titleReadOnly: title.name,
        releaseYearReadOnly: title.releaseYear,
        title: '',
        releaseYear: '',
        externalSystemIds: [],
    };
    const form = useForm({
        defaultValues: initialValues,
        mode: 'all',
        reValidateMode: 'onChange',
    });
    const {
        control,
        reset,
        setValue,
        handleSubmit,
        formState: {isValid},
    } = form;

    const navigate = useNavigate();
    const routeParams = useParams();
    const dispatch = useDispatch();
    const currentValues = useWatch({control});
    const [isCreatingTitle, setIsCreatingTitle] = useState(false);

    /**
     * Reset form fields
     */
    const resetFormValues = () => {
        reset(initialValues);
        setValue('externalSystemIds', []);
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
                        disabled={isCreatingTitle}
                        className="p-button-outlined p-button-secondary"
                    />
                    <Button
                        id="titleCreateCopyBtn"
                        label="Create a Copy"
                        onClick={async e => {
                            await handleSubmit(onSubmit)(e);
                        }}
                        loading={isCreatingTitle}
                        loadingIcon="pi pi-spin pi-spinner"
                        className="p-button-outlined"
                        iconPos="right"
                    />
                </div>
            </div>
        );
    };

    const handleError = err => {
        setIsCreatingTitle(false);
        toastMessage('error', err.message.description);
    };

    const successCreateCopyTitle = titleId => {
        setIsCreatingTitle(false);
        resetFormValues();
        handleCloseModal();
        const url = `/${routeParams.realm}/metadata`;
        navigate(url);
        toastMessage('success', constants.NEW_TITLE_TOAST_SUCCESS_MESSAGE, titleId);
    };

    const saveTitle = titleForm => {
        titleServiceSingleton
            .create(titleForm)
            .then(response => {
                const titleId = response.meta.id;
                if (editorialMetadata?.length > 0) {
                    // construct copy emets from title and clean emets get them ready for copy them to new tittle
                    const constructEmets = x => {
                        arrayDeletedEmetKeys.forEach(keyDelete => {
                            delete x[keyDelete];
                        });
                        return {
                            ...x,
                            isUpdated: true,
                            isCreated: true,
                        };
                    };
                    const newEmets = editorialMetadata.map(x => constructEmets(x));
                    createEditorialMetadata(newEmets, titleId);
                } else {
                    successCreateCopyTitle(titleId);
                }
            })
            .catch(handleError);
    };

    /**
     * To copy Title, please specify a different Title name and/or Release Year.
     * @returns validCopyTitle
     */
    const isCopyTitleValid = () => {
        const original = concatValidationString(currentValues.titleReadOnly, currentValues.releaseYearReadOnly);
        const copy = concatValidationString(currentValues.title, currentValues.releaseYear);
        return original !== copy;
    };

    const concatValidationString = (title, releaseYear) => {
        // replace all white spaces with single space
        return `${title.trim()}${releaseYear.trim()}`.replace(/\s+/g, ' ').toLowerCase();
    };

    /**
     * Universal toast message
     * @param {*} severityType
     * @param {*} detailDescription
     * @param {*} summaryDescription
     * @param {*} titleId
     */
    const toastMessage = (severityType, detailDescription, titleId = null) => {
        const isToastWithButton = !!titleId;

        dispatch(
            addToast({
                severity: severityType,
                content: isToastWithButton
                    ? () => {
                          return (
                              <Button
                                  label="View Title"
                                  className="p-button-link p-toast-button-link bg-transparent border-0"
                                  onClick={() => onViewTitleClick(titleId, routeParams.realm)}
                              />
                          );
                      }
                    : undefined,
                detail: detailDescription,
            })
        );
    };

    /**
     * Saving new Title
     * @param {form values} submitTitleForm
     * @returns
     */
    const onSubmit = submitTitleForm => {
        if (isValid) {
            const newTitle = {
                // copied content from original title (PO requirements we are not copy all)
                contentSubType: title.contentSubType,
                contentType: title.contentType,
                ratings: title.ratings,
                castCrew: title.castCrew,
                animated: title.animated,
                audience: title.audience,
                categories: title.categories,
                countryOfOrigin: title.countryOfOrigin,
                duration: title.duration,
                eventType: title.eventType,
                imdbLink: title.imdbLink,
                metadataStatus: title.metadataStatus,
                originalLanguage: title.originalLanguage,
                usBoxOffice: title.usBoxOffice,
                // form values
                name: submitTitleForm.title,
                releaseYear: submitTitleForm.releaseYear,
                externalSystemIds: submitTitleForm?.externalSystemIds?.length ? submitTitleForm.externalSystemIds : [],
            };

            if (searchForExternalIDsDuplicates(newTitle)) {
                toastMessage('error', constants.EXTERNAL_ID_TYPE_DUPLICATE_ERROR);
                return;
            }

            if (!isCopyTitleValid()) {
                toastMessage('error', constants.COPY_TITLE_ERROR);
                return;
            }
            setIsCreatingTitle(true);
            saveTitle(newTitle);
        }
    };

    /**
     * ExternalID validation for duplicates
     * @param {*} title
     * @returns
     */
    const searchForExternalIDsDuplicates = newTitle => {
        const externalIdArray = newTitle?.externalSystemIds?.map(item => item.titleId);
        const externalIdTypesArray = newTitle?.externalSystemIds?.map(item => item.externalSystem);
        const findDuplicates = arr => arr?.filter((item, index) => arr.indexOf(item) !== index);
        const indexOfDuplicateID = findDuplicates(externalIdArray).length;
        const indexOfDuplicateType = findDuplicates(externalIdTypesArray).length;

        return !!(indexOfDuplicateID && indexOfDuplicateType);
    };

    /**
     * Create editorial metadata
     * @param {*} editorialMetadata
     * @param {*} titleId
     */
    const createEditorialMetadata = async (editorialMetadata, titleId) => {
        const newEmets = editorialMetadata
            ? editorialMetadata.map(emet => formatEditorialBody(emet, titleId, true))
            : [];

        if (newEmets.length > 0) {
            const updatedEditorialMetadata = newEmets.map(item => ({
                ...item,
                body: {
                    ...item?.body,
                    editorialMetadata: {
                        ...item?.body?.editorialMetadata,
                        type: 'editorialMetadata',
                    },
                },
            }));
            // call create api
            titleEditorialService.create(updatedEditorialMetadata).then(() => {
                successCreateCopyTitle(titleId);
            });
        }
    };

    return (
        <Dialog
            header="Copy Title"
            visible={display}
            style={{width: '50vw'}}
            footer={renderFooter()}
            onHide={() => null}
            closeOnEscape={false}
            closable={false}
        >
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row pt-1">
                        <div className="col-12">
                            <p>To copy Title, please specify a different Title name and/or Release Year.</p>
                            <p className="pt-3">
                                The following data will be copied from the source Title: Core Title, Cast & Crew,
                                Ratings, Editorial Metadata.
                            </p>
                        </div>
                    </div>
                    <div className="row pt-3">
                        <div className="col-12">
                            <div className="row ">
                                <div className="col-12">
                                    <NexusEntity type={NEXUS_ENTITY_TYPES.subsection} heading="SOURCE TITLE" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-8">
                                    <InputText
                                        readOnly={true}
                                        formControlOptions={{
                                            formControlName: `titleReadOnly`,
                                        }}
                                        labelProps={{label: 'Title', stacked: true}}
                                        id="titleReadOnly"
                                        className="nexus-c-title-create-copy_input-readonly"
                                        value={title.name}
                                    />
                                </div>
                                <div className="col-4">
                                    <InputText
                                        readOnly={true}
                                        formControlOptions={{
                                            formControlName: `releaseYearReadOnly`,
                                        }}
                                        labelProps={{
                                            label: 'Release Year',
                                            stacked: true,
                                        }}
                                        id="releaseYearReadOnly"
                                        className="nexus-c-title-create-copy_input-readonly"
                                        value={title.releaseYear}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-12">
                                    <NexusEntity type={NEXUS_ENTITY_TYPES.subsection} heading="NEW TITLE" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-8">
                                    <InputText
                                        formControlOptions={{
                                            formControlName: `title`,
                                            rules: {
                                                required: {value: true, message: 'Field cannot be empty!'},
                                                maxLength: {
                                                    value: constants.CREATE_TITLE_RESTRICTIONS.MAX_TITLE_LENGTH,
                                                    message: `Max title length is ${constants.CREATE_TITLE_RESTRICTIONS.MAX_TITLE_LENGTH}!`,
                                                },
                                            },
                                        }}
                                        labelProps={{label: 'Title', stacked: true, isRequired: true}}
                                        id="title"
                                        placeholder="Enter Title"
                                    />
                                </div>
                                <div className="col-4">
                                    <InputText
                                        formControlOptions={{
                                            formControlName: `releaseYear`,
                                            rules: {
                                                required: {
                                                    value: true,
                                                    message: 'Field cannot be empty!',
                                                },
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: 'Please enter a valid year!',
                                                },
                                                maxLength: {
                                                    value: constants.CREATE_TITLE_RESTRICTIONS.MAX_RELEASE_YEAR_LENGTH,
                                                    message: `Max release year length is ${constants.CREATE_TITLE_RESTRICTIONS.MAX_RELEASE_YEAR_LENGTH}!`,
                                                },
                                                minLength: {
                                                    value: constants.CREATE_TITLE_RESTRICTIONS.MAX_RELEASE_YEAR_LENGTH,
                                                    message: `Min release year length is ${constants.CREATE_TITLE_RESTRICTIONS.MAX_RELEASE_YEAR_LENGTH}!`,
                                                },
                                            },
                                        }}
                                        labelProps={{
                                            label: 'Release Year',
                                            stacked: true,
                                            isRequired: true,
                                        }}
                                        id="releaseYear"
                                        placeholder="Enter Release Year"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            {externalIdOptions?.values && (
                                <ExternalIDsSection
                                    control={control}
                                    externalDropdownOptions={externalIdOptions}
                                    header="NEW TITLE EXTERNAL IDs"
                                />
                            )}
                        </div>
                    </div>
                </form>
            </FormProvider>
        </Dialog>
    );
};

TitleCreateCopyModal.propTypes = {
    title: PropTypes.object,
    display: PropTypes.bool,
    defaultValues: PropTypes.object,
    handleCloseModal: PropTypes.func,
    externalIdOptions: PropTypes.object,
    editorialMetadata: PropTypes.array,
};

TitleCreateCopyModal.defaultProps = {
    title: {},
    display: false,
    defaultValues: {},
    handleCloseModal: () => null,
    externalIdOptions: {},
    editorialMetadata: [],
};

export default TitleCreateCopyModal;
