import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm} from '@atlaskit/form';
import classnames from 'classnames';
import {merge} from 'lodash';
import moment from 'moment';
import {buildSection, getProperValues, getAllFields} from './utils';
import {VIEWS} from './constants';
import './NexusDynamicForm.scss';

const NexusDynamicForm = ({schema = {}, initialData, onSubmit, isEdit, selectValues, containerRef, isTitlePage}) => {
    const [view, setView] = useState(isEdit ? VIEWS.VIEW : VIEWS.CREATE);
    const [update, setUpdate] = useState(false);

    const {fields} = schema;
    useEffect(() => {
        update && setUpdate(false);
    }, [update]);

    const buildButtons = (dirty, submitting, reset) => {
        return view !== VIEWS.VIEW ? (
            <>
                <Button
                    type="submit"
                    className={classnames('nexus-c-dynamic-form__submit-button', {
                        'nexus-c-dynamic-form__submit-button--title': isTitlePage,
                    })}
                    appearance="primary"
                    isDisabled={!dirty || submitting}
                >
                    Save changes
                </Button>
                <Button
                    className={classnames('nexus-c-dynamic-form__cancel-button', {
                        'nexus-c-dynamic-form__cancel-button--title': isTitlePage,
                    })}
                    onClick={() => {
                        reset();
                        setUpdate(true);
                        setView(VIEWS.VIEW);
                    }}
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
                onClick={() => setView(VIEWS.EDIT)}
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
        if (validDateRange(values)) {
            setView(VIEWS.VIEW);
            const properValues = getProperValues(fields, values);
            onSubmit(merge({}, initialData, properValues));
        }
    };

    return (
        <div className="nexus-c-dynamic-form">
            <AKForm onSubmit={values => handleOnSubmit(values, initialData)}>
                {({formProps, dirty, submitting, reset, getValues, setFieldValue}) => (
                    <form {...formProps}>
                        {buildButtons(dirty, submitting, reset)}
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
                                    {sections.map(({title: sectionTitle = '', fields = {}}) => (
                                        <Fragment key={`section-${sectionTitle}`}>
                                            <h3 className="nexus-c-dynamic-form__section-title">{sectionTitle}</h3>
                                            {buildSection(fields, getValues, view, {
                                                selectValues,
                                                initialData,
                                                setFieldValue,
                                                update,
                                                config: schema.config || [],
                                            })}
                                        </Fragment>
                                    ))}
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
};

NexusDynamicForm.defaultProps = {
    initialData: {},
    onSubmit: undefined,
    isEdit: false,
    selectValues: {},
    containerRef: null,
    isTitlePage: false,
};

export default NexusDynamicForm;
