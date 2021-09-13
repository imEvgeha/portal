import React, {Fragment, useState, useEffect, useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm, ErrorMessage} from '@atlaskit/form';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import classnames from 'classnames';
import {mergeWith, set, get} from 'lodash';
import moment from 'moment';
import PropagateForm from '../../../../../src/pages/title-metadata/components/title-metadata-details/components/PropagateForm';
import PropagateButton from '../nexus-person/elements/PropagateButton/PropagateButton';
import {buildSection, getProperValues, getProperValue, getAllFields} from './utils';
import {VIEWS, SEASON, SERIES, EPISODE, CORE_TITLE_SECTION, CAST_AND_CREW_TITLE, PROPAGATE_TITLE} from './constants';
import './NexusDynamicForm.scss';

const NexusDynamicForm = ({
    schema = {},
    initialData,
    onSubmit,
    canEdit,
    selectValues,
    isSaving,
    containerRef,
    isTitlePage,
    searchPerson,
    generateMsvIds,
    regenerateAutoDecoratedMetadata,
    hasButtons,
    setRefresh,
    castCrewConfig,
}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [update, setUpdate] = useState(false);
    const [validationErrorCount, setValidationErrorCount] = useState(0);

    const view = canEdit ? VIEWS.EDIT : VIEWS.VIEW;

    const {fields} = schema;
    useEffect(() => {
        update && setUpdate(false);
    }, [update]);

    useEffect(() => {
        // eslint-disable-next-line prefer-destructuring
        const firstErrorElement = document.getElementsByClassName('nexus-c-field__error')[0];
        if (firstErrorElement) firstErrorElement.scrollIntoView(false);
    }, [validationErrorCount]);

    const showValidationError = () => {
        const errorsCount = document.getElementsByClassName('nexus-c-field__error').length;
        errorsCount && setValidationErrorCount(errorsCount);
    };

    const onCancel = reset => {
        reset();
        setUpdate(true);
        setValidationErrorCount(0);
    };

    const formStatus = (dirty, errors) => {
        if (errors > 0) return 'error';
        if (dirty) return 'updated';
        return 'success';
    };

    const buildButtons = (dirty, reset, errors) => (
        <>
            {errors > 0 && (
                <div className="nexus-c-dynamic-form__validation-msg">
                    <ErrorMessage>
                        {errors} {errors === 1 ? 'error' : 'errors'} on page
                    </ErrorMessage>
                </div>
            )}
            <div className="nexus-c-dynamic-form__actions-container">
                <Button
                    type="submit"
                    className="nexus-c-dynamic-form__submit-button"
                    isDisabled={(!dirty && disableSubmit) || !canEdit}
                    // this is a form submit button and hence validation check will not work on submit function
                    onClick={showValidationError}
                    isLoading={isSaving}
                >
                    Save
                </Button>
                <div className={`nexus-c-dynamic-form__status ${formStatus(dirty, errors)}`} />
                <Button
                    className="nexus-c-dynamic-form__discard-button"
                    onClick={() => onCancel(reset)}
                    isDisabled={!dirty || isSaving || !canEdit}
                >
                    Discard
                </Button>
            </div>
        </>
    );

    const validDateRange = values => {
        let areValid = true;
        const allFields = getAllFields(fields);
        Object.keys(allFields)
            .filter(key => allFields[key].type === 'dateRange')
            .forEach(key => {
                const {startDate, endDate} = values[key];
                if (moment(startDate).isAfter(endDate) || moment(endDate).isBefore(startDate)) {
                    areValid = false;
                }
            });
        return areValid;
    };

    const handleOnSubmit = (values, initialData) => {
        setValidationErrorCount(0);
        if (validDateRange(values)) {
            const properValues = getProperValues(fields, values);
            const correctValues = {};
            Object.keys(properValues).forEach(key => set(correctValues, key, properValues[key]));
            onSubmit(
                mergeWith({}, initialData, correctValues, (obj, src) => {
                    if (Array.isArray(src)) {
                        return src;
                    }
                    // keep original null value if updated value is object and all its properties are falsy
                    // non object values are null already if not edited
                    else if (obj === null && typeof src === 'object') {
                        if (!src) return null;
                        if (
                            !Object.keys(src).some(k => {
                                if (Array.isArray(src[k]))
                                    // if value is array
                                    return src[k].length;
                                else if (typeof src[k] === 'object' && src[k] !== null)
                                    // if value is object
                                    return Object.keys(src[k]).length;
                                return src[k]; // else return value
                            })
                        )
                            return null;
                    }
                }),
                initialData
            );
        }
    };

    const createLink = contentType => {
        const baseUrl = '/metadata/?parentId=';
        const id = get(initialData, 'id', '');
        return `${baseUrl}${id}&contentType=${contentType === SERIES ? SEASON : EPISODE}`;
    };

    const showAll = () => {
        if (isTitlePage) {
            const allowedContents = [SEASON, SERIES];
            const contentType = get(initialData, 'contentType', '');
            if (allowedContents.includes(contentType)) {
                return (
                    <div className="nexus-c-dynamic-form__show-all">
                        <a href={createLink(contentType)}>Show all {contentType === SERIES ? 'seasons' : 'episodes'}</a>
                    </div>
                );
            }
        }
        return null;
    };

    const showPropagateModal = useCallback((getValues, setFieldValue) => {
        openModal(<PropagateForm getValues={getValues} setFieldValue={setFieldValue} onClose={closeModal} />, {
            title: PROPAGATE_TITLE,
            width: 'small',
        });
    }, []);

    return (
        <div className="nexus-c-dynamic-form">
            <AKForm onSubmit={values => handleOnSubmit(values, initialData)}>
                {({formProps, dirty, reset, getValues, setFieldValue}) => (
                    <form {...formProps}>
                        {hasButtons && buildButtons(dirty, reset, validationErrorCount)}
                        <div
                            ref={containerRef}
                            className={classnames('nexus-c-dynamic-form__tab-container', {
                                'nexus-c-dynamic-form__tab-container--title': isTitlePage,
                            })}
                        />
                        <div
                            className={classnames('nexus-c-dynamic-form__tab-content', {
                                'nexus-c-dynamic-form__tab-content--title': isTitlePage,
                            })}
                        >
                            {fields.map(({title = '', sections = []}, index) => (
                                <div
                                    key={`tab-${title}`}
                                    id={`tab-${index}`}
                                    className="nexus-c-dynamic-form__section-start"
                                >
                                    {sections.map(
                                        ({
                                            title: sectionTitle = '',
                                            fields = {},
                                            isGridLayout = false,
                                            tabs,
                                            subTabs,
                                            prefix,
                                        }) => (
                                            <Fragment key={`section-${sectionTitle}`}>
                                                <h3 className="nexus-c-dynamic-form__section-title">
                                                    {sectionTitle === CAST_AND_CREW_TITLE && canEdit ? (
                                                        <div className="nexus-c-dynamic-form__additional-option">
                                                            {sectionTitle}
                                                            <PropagateButton
                                                                onClick={() =>
                                                                    showPropagateModal(getValues, setFieldValue)
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        sectionTitle
                                                    )}
                                                </h3>
                                                {sectionTitle === CORE_TITLE_SECTION && showAll()}
                                                {buildSection(
                                                    fields,
                                                    getValues,
                                                    view,
                                                    generateMsvIds,
                                                    regenerateAutoDecoratedMetadata,
                                                    setRefresh,
                                                    {
                                                        selectValues,
                                                        initialData,
                                                        setFieldValue,
                                                        update,
                                                        config: schema.config || [],
                                                        isGridLayout,
                                                        searchPerson,
                                                        castCrewConfig,
                                                        tabs,
                                                        subTabs,
                                                        setDisableSubmit,
                                                        prefix,
                                                    }
                                                )}
                                            </Fragment>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </form>
                )}
            </AKForm>
        </div>
    );
};

NexusDynamicForm.propTypes = {
    schema: PropTypes.object.isRequired,
    initialData: PropTypes.object,
    onSubmit: PropTypes.func,
    canEdit: PropTypes.bool,
    selectValues: PropTypes.object,
    containerRef: PropTypes.any,
    isTitlePage: PropTypes.bool,
    searchPerson: PropTypes.func,
    generateMsvIds: PropTypes.func,
    isSaving: PropTypes.bool,
    regenerateAutoDecoratedMetadata: PropTypes.func,
    hasButtons: PropTypes.bool,
    setRefresh: PropTypes.func,
    castCrewConfig: PropTypes.object,
};

NexusDynamicForm.defaultProps = {
    initialData: {},
    onSubmit: undefined,
    canEdit: false,
    selectValues: {},
    containerRef: null,
    isTitlePage: false,
    searchPerson: undefined,
    generateMsvIds: undefined,
    isSaving: false,
    regenerateAutoDecoratedMetadata: undefined,
    hasButtons: true,
    setRefresh: () => null,
    castCrewConfig: {},
};

export default NexusDynamicForm;
