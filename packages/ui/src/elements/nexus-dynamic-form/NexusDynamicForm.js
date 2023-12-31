import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {default as AKForm, ErrorMessage} from '@atlaskit/form';
import {isAllowed, Restricted} from '@portal/portal-auth/permissions';
import classnames from 'classnames';
import {isEmpty, mergeWith, set} from 'lodash';
import moment from 'moment';
import ButtonsBuilder from './components/ButtonsBuilder/ButtonsBuilder';
import {buildSection, getAllFields, getProperValue, getProperValues} from './utils';
import {VIEWS} from './constants';
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
    castCrewConfig,
    seasonPersons,
    titleActionComponents,
    isFullScreen,
    formFooter,
    actions,
}) => {
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [update, setUpdate] = useState(false);
    const [validationErrorCount, setValidationErrorCount] = useState(0);
    const view = canEdit ? VIEWS.EDIT : VIEWS.VIEW;
    const {fields} = schema;
    const hasPermissionsToEdit = () => isAllowed('editTitleDetails');

    useEffect(() => {
        update && setUpdate(false);
    }, [update]);

    useEffect(() => {
        // eslint-disable-next-line prefer-destructuring
        const firstErrorElement = document.getElementsByClassName('nexus-c-field--error')[0];
        if (firstErrorElement) firstErrorElement.scrollIntoView(false);
    }, [validationErrorCount]);

    const onCancel = () => {
        actions.setRefresh(prev => !prev);
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
                {hasPermissionsToEdit() && (
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
                        showValidationError={() => showValidationError()}
                    />
                )}
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

            Object.keys(correctValues).forEach(k => {
                correctValues[k] =
                    Array.isArray(correctValues[k]) && !correctValues[k].length ? null : correctValues[k];
            });

            const valuesData = mergeWith({}, initialData, correctValues, (obj, src, key) => {
                // some keys should not return undefined value for arrays and instead have empty array,
                // for example when deleting all MSV association IDs, we want to return empty Array
                const excludedValues = ['msvAssociationId'];
                if (Array.isArray(src)) {
                    if (src.length || excludedValues.includes(key)) {
                        return src;
                    }
                    return undefined;
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

    return (
        <div className={isFullScreen ? 'nexus-c-dynamic-form-fullscreen' : 'nexus-c-dynamic-form'}>
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
                                        (
                                            {
                                                title: sectionTitle = '',
                                                sectionID,
                                                titleActions = [],
                                                fields = {},
                                                isGridLayout = false,
                                                tabs,
                                                subTabs,
                                                prefix,
                                                resource,
                                            },
                                            sectionIndex
                                        ) => (
                                            <Restricted key={`section-${sectionTitle}`} resource={resource}>
                                                <Fragment key={`section-${sectionTitle}`}>
                                                    {sectionTitle && (
                                                        <h3 className="nexus-c-dynamic-form__section-title">
                                                            {sectionTitle}
                                                        </h3>
                                                    )}
                                                    {titleActionComponents &&
                                                        titleActions.map(action =>
                                                            titleActionComponents[action](
                                                                setUpdate,
                                                                getValues,
                                                                setFieldValue,
                                                                `${action}_${index}_${sectionIndex}`
                                                            )
                                                        )}

                                                    {buildSection(
                                                        fields,
                                                        getValues,
                                                        view,
                                                        generateMsvIds,
                                                        regenerateAutoDecoratedMetadata,
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
                                                            sectionID,
                                                            actions,
                                                        }
                                                    )}
                                                </Fragment>
                                            </Restricted>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                        {formFooter && formFooter}
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
    castCrewConfig: PropTypes.object,
    storedInitialData: PropTypes.object,
    seasonPersons: PropTypes.array,
    titleActionComponents: PropTypes.object,
    isFullScreen: PropTypes.bool,
    formFooter: PropTypes.element,
    actions: PropTypes.object,
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
    castCrewConfig: {},
    storedInitialData: null,
    seasonPersons: [],
    titleActionComponents: {},
    isFullScreen: false,
    formFooter: undefined,
    actions: {},
};

export default NexusDynamicForm;
