import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm, ErrorMessage} from '@atlaskit/form';
import classnames from 'classnames';
import {merge, set} from 'lodash';
import moment from 'moment';
import {buildSection, getProperValues, getAllFields} from './utils';
import {VIEWS} from './constants';
import './NexusDynamicForm.scss';

const NexusDynamicForm = ({
    schema = {},
    initialData,
    onSubmit,
    isEdit,
    selectValues,
    isSaving,
    containerRef,
    isTitlePage,
    searchPerson,
    generateMsvIds,
    regenerateAutoDecoratedMetadata,
    hasButtons,
    setIsEditView,
}) => {
    const [view, setView] = useState(isEdit ? VIEWS.VIEW : VIEWS.CREATE);
    const [update, setUpdate] = useState(false);
    const [validationErrorCount, setValidationErrorCount] = useState(0);

    const {fields} = schema;
    useEffect(() => {
        update && setUpdate(false);
    }, [update]);

    useEffect(() => {
        if (!isSaving) {
            setView(VIEWS.VIEW);
            setIsEditView(false);
        }
    }, [isSaving]);

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
        setView(VIEWS.VIEW);
        setIsEditView(false);
        setValidationErrorCount(0);
    };

    const buildButtons = (dirty, reset, errors) => {
        return view !== VIEWS.VIEW ? (
            <>
                {errors > 0 && (
                    <div className="nexus-c-dynamic-form__validation-msg">
                        <ErrorMessage>{errors} errors on page</ErrorMessage>
                    </div>
                )}
                <Button
                    type="submit"
                    className={classnames('nexus-c-dynamic-form__submit-button', {
                        'nexus-c-dynamic-form__submit-button--title': isTitlePage,
                    })}
                    appearance="primary"
                    isDisabled={!dirty}
                    // this is a form submit button and hence validation check will not work on submit function
                    onClick={showValidationError}
                    isLoading={isSaving}
                >
                    Save changes
                </Button>
                <Button
                    className={classnames('nexus-c-dynamic-form__cancel-button', {
                        'nexus-c-dynamic-form__cancel-button--title': isTitlePage,
                    })}
                    onClick={() => onCancel(reset)}
                >
                    Cancel
                </Button>
            </>
        ) : (
            <Button
                className={classnames('nexus-c-dynamic-form__edit-button', {
                    'nexus-c-dynamic-form__edit-button--title': isTitlePage,
                })}
                appearance="primary"
                onClick={() => {
                    setView(VIEWS.EDIT);
                    setIsEditView(true);
                }}
            >
                Edit
            </Button>
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
            const properValues = getProperValues(fields, values);
            const correctValues = {};
            Object.keys(properValues).forEach(key => set(correctValues, key, properValues[key]));
            onSubmit(merge({}, initialData, correctValues));
        }
    };

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
                                        }) => (
                                            <Fragment key={`section-${sectionTitle}`}>
                                                <h3 className="nexus-c-dynamic-form__section-title">{sectionTitle}</h3>
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
                                                        tabs,
                                                        subTabs,
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
    isEdit: PropTypes.bool,
    selectValues: PropTypes.object,
    containerRef: PropTypes.any,
    isTitlePage: PropTypes.bool,
    searchPerson: PropTypes.func,
    generateMsvIds: PropTypes.func,
    isSaving: PropTypes.bool,
    regenerateAutoDecoratedMetadata: PropTypes.func,
    hasButtons: PropTypes.bool,
    setIsEditView: PropTypes.func,
};

NexusDynamicForm.defaultProps = {
    initialData: {},
    onSubmit: undefined,
    isEdit: false,
    selectValues: {},
    containerRef: null,
    isTitlePage: false,
    searchPerson: undefined,
    generateMsvIds: undefined,
    isSaving: false,
    regenerateAutoDecoratedMetadata: undefined,
    hasButtons: true,
    setIsEditView: () => null,
};

export default NexusDynamicForm;
