import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm} from '@atlaskit/form';
import classnames from 'classnames';
import moment from 'moment';
import SectionTab from './components/SectionTab/SectionTab';
import {buildSection, getProperValues, getAllFields} from './utils';
import {VIEWS} from './constants';
import './NexusDynamicForm.scss';

const NexusDynamicForm = ({schema = [], initialData, onSubmit, isEdit, selectValues, containerRef, isTitlePage}) => {
    const tabs = schema.map(({title = ''}) => title);
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [update, setUpdate] = useState(false);
    const [view, setView] = useState(isEdit ? VIEWS.VIEW : VIEWS.CREATE);

    useEffect(() => {
        update && setUpdate(false);
    }, [update]);

    const buildTabs = () => {
        return tabs.map(tab => (
            <SectionTab key={tab} section={tab} onClick={() => setSelectedTab(tab)} isActive={selectedTab === tab} />
        ));
    };

    const buildButtons = (dirty, submitting, reset, setFieldValue) => {
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
                        setFieldValue('territory', initialData['territory']);
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
        const allFields = getAllFields(schema);
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

    const handleOnSubmit = values => {
        if (validDateRange(values)) {
            setView(VIEWS.VIEW);
            const properValues = getProperValues(schema, values);
            onSubmit(properValues);
        }
    };

    return (
        <div className="nexus-c-dynamic-form">
            <AKForm onSubmit={values => handleOnSubmit(values)}>
                {({formProps, dirty, submitting, reset, getValues, setFieldValue}) => (
                    <form {...formProps}>
                        {buildButtons(dirty, submitting, reset, setFieldValue)}
                        <div
                            ref={containerRef}
                            className={classnames('nexus-c-dynamic-form__tab-container', {
                                'nexus-c-dynamic-form__tab-container--title': isTitlePage,
                            })}
                        >
                            {buildTabs()}
                        </div>
                        <div
                            className={classnames('nexus-c-dynamic-form__tab-content', {
                                'nexus-c-dynamic-form__tab-content--title': isTitlePage,
                            })}
                        >
                            {schema.map(({title = '', sections = []}) => (
                                <Fragment key={`tab-${title}`}>
                                    {sections.map(({title: sectionTitle = '', fields = {}}) => (
                                        <Fragment key={`section-${sectionTitle}`}>
                                            <h3 id={sectionTitle} className="nexus-c-dynamic-form__section-title">
                                                {sectionTitle}
                                            </h3>
                                            {buildSection(fields, getValues, view, {
                                                selectValues,
                                                initialData,
                                                setFieldValue,
                                                update,
                                            })}
                                        </Fragment>
                                    ))}
                                </Fragment>
                            ))}
                        </div>
                    </form>
                )}
            </AKForm>
        </div>
    );
};

NexusDynamicForm.propTypes = {
    schema: PropTypes.array.isRequired,
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
