import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {default as AKForm, ErrorMessage} from '@atlaskit/form';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import classnames from 'classnames';
import {get, isEmpty, mergeWith, set} from 'lodash';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
import PropagateForm from '../../../../../src/pages/title-metadata/components/title-metadata-details/components/PropagateForm';
import {clearTitleMetadataFilter} from '../../../../../src/pages/title-metadata/titleMetadataActions';
import PropagateButton from '../nexus-person/elements/PropagateButton/PropagateButton';
import ButtonsBuilder from './components/ButtonsBuilder/ButtonsBuilder';
import {buildSection, getAllFields, getProperValue, getProperValues} from './utils';
import {CAST_AND_CREW_TITLE, CORE_TITLE_SECTION, EPISODE, PROPAGATE_TITLE, SEASON, SERIES, VIEWS} from './constants';
import './NexusDynamicForm.scss';

const NexusDynamicForm = ({
    schema,
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
    seasonPersons,
}) => {
    const dispatch = useDispatch();

    const {openModal, closeModal} = useContext(NexusModalContext);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [update, setUpdate] = useState(false);
    const [validationErrorCount, setValidationErrorCount] = useState(0);
    const routeParams = useParams();

    const view = canEdit ? VIEWS.EDIT : VIEWS.VIEW;

    const {fields} = schema;

    useEffect(() => {
        update && setUpdate(false);
    }, [update]);

    useEffect(() => {
        // eslint-disable-next-line prefer-destructuring
        const firstErrorElement = document.getElementsByClassName('nexus-c-field--error')[0];
        if (firstErrorElement) firstErrorElement.scrollIntoView(false);
    }, [validationErrorCount]);

    const onCancel = () => {
        setRefresh(prev => !prev);
        setUpdate(true);
        setValidationErrorCount(0);
    };

    const showValidationError = () => {
        const errorsCount = document.getElementsByClassName('nexus-c-field--error').length;
        setValidationErrorCount(errorsCount);
    };

    const buttonsBuilder = (dirty, reset, errors) => {
        return (
            <>
                {errors > 0 && (
                    <div className="nexus-c-dynamic-form__validation-msg">
                        <ErrorMessage>
                            {errors} {errors === 1 ? 'error' : 'errors'} on page
                        </ErrorMessage>
                    </div>
                )}
                <ButtonsBuilder
                    dirty={dirty}
                    reset={reset}
                    validationErrorCount={validationErrorCount}
                    errors={validationErrorCount}
                    disableSubmit={disableSubmit}
                    canEdit={canEdit}
                    isSaving={isSaving}
                    isEmpty={isEmpty}
                    onCancel={onCancel}
                    seasonPersons={seasonPersons}
                    showValidationError={showValidationError()}
                />
            </>
        );
    };

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
            let correctValues = {};
            const allValues = getAllFields(fields);
            const properValues = getProperValues(fields, values);
            Object.values(allValues).forEach(({type, path}) => {
                const defaultValue = getProperValue(type, null, path, fields);
                correctValues = {...(type === 'array' && defaultValue), ...correctValues};
            });
            Object.keys(properValues).forEach(key => set(correctValues, key, properValues[key]));

            const valuesData = mergeWith({}, initialData, correctValues, (obj, src) => {
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
            });

            onSubmit(valuesData, initialData);
        }
    };

    const createLink = contentType => {
        const baseUrl = '/metadata/?parentId=';
        const id = get(initialData, 'id', '');
        return `/${routeParams.realm}${baseUrl}${id}&contentType=${contentType === SERIES ? SEASON : EPISODE}`;
    };

    const showAll = () => {
        if (isTitlePage) {
            const allowedContents = [SEASON, SERIES];
            const contentType = get(initialData, 'contentType', '');
            if (allowedContents.includes(contentType)) {
                return (
                    <div className="nexus-c-dynamic-form__show-all">
                        <Link onClick={() => dispatch(clearTitleMetadataFilter())} to={createLink(contentType)}>
                            Show all {contentType === SERIES ? 'seasons' : 'episodes'}
                        </Link>
                    </div>
                );
            }
        }
        return null;
    };

    const closePropagateModal = () => {
        closeModal();
        setUpdate(prev => !prev);
    };

    const showPropagateModal = useCallback((getValues, setFieldValue) => {
        openModal(<PropagateForm getValues={getValues} setFieldValue={setFieldValue} onClose={closePropagateModal} />, {
            title: PROPAGATE_TITLE,
            width: 'small',
        });
    }, []);

    return (
        <div className="nexus-c-dynamic-form">
            <AKForm onSubmit={values => handleOnSubmit(values, initialData)}>
                {({formProps, dirty, reset, getValues, setFieldValue}) => (
                    <form {...formProps}>
                        {hasButtons && buttonsBuilder(dirty, reset, validationErrorCount)}
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
                                                    {sectionTitle === CAST_AND_CREW_TITLE && isTitlePage && canEdit ? (
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
                                                        isTitlePage,
                                                        setUpdate,
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
    schema: PropTypes.object,
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
    storedInitialData: PropTypes.object,
    seasonPersons: PropTypes.array,
};

NexusDynamicForm.defaultProps = {
    schema: {},
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
    storedInitialData: null,
    seasonPersons: [],
};

export default NexusDynamicForm;
