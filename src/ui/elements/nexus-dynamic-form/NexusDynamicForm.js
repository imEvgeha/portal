import React, {Fragment, useState, useEffect} from 'react';
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
    const tabs = schema.map(({title = ''}, index) => {
        return {
            title,
            id: `tab-${index}`,
        };
    });
    const [selectedTab, setSelectedTab] = useState(tabs[0].title);
    const [view, setView] = useState(isEdit ? VIEWS.VIEW : VIEWS.CREATE);

    useEffect(() => {
        const sectionIDs = tabs.map((_, index) => document.getElementById(`tab-${index}`));

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2,
        };

        const observerCallback = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const focusedTab = tabs.find(item => item.id === entry.target.id);
                    focusedTab.title && setSelectedTab(focusedTab.title);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sectionIDs.forEach(sec => sec instanceof HTMLElement && observer.observe(sec));
    }, []);

    const buildTabs = () => {
        return tabs.map((tab, index) => (
            <SectionTab
                key={tab.title}
                section={tab.title}
                onClick={() => setSelectedTab(tab.title)}
                isActive={selectedTab === tab.title}
                sectionId={`tab-${index}`}
            />
        ));
    };

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
                        {buildButtons(dirty, submitting, reset)}
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
                            {schema.map(({title = '', sections = []}, index) => (
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
