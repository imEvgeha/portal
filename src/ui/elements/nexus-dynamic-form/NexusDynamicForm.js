import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm} from '@atlaskit/form';
import moment from 'moment';
import SectionTab from './components/SectionTab/SectionTab';
import {buildSection, getProperValues, getAllFields} from './utils';
import {VIEWS} from './constants';
import './NexusDynamicForm.scss';

const NexusDynamicForm = ({schema = [], initialData, onSubmit, isEdit, selectValues, containerRef}) => {
    const tabs = schema.map(({title = ''}, index) => {
        return {
            title,
            id: title.split(' ')[0] + index.toString(),
        };
    });
    const [selectedTab, setSelectedTab] = useState(tabs[0].title);
    const [view, setView] = useState(isEdit ? VIEWS.VIEW : VIEWS.CREATE);

    useEffect(() => {
        const sectionIDs = tabs.map(item => document.getElementById(item.id));

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 1,
        };

        const observerCallback = entries => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    const index = tabs.findIndex(item => item.id === entry.target.id);
                    index !== -1 && setSelectedTab(tabs[index].title);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sectionIDs.forEach(sec => sec instanceof HTMLElement && observer.observe(sec));
    }, []);

    const buildTabs = () => {
        return tabs.map(tab => (
            <SectionTab
                key={tab.title}
                section={tab.title}
                onClick={() => setSelectedTab(tab.title)}
                isActive={selectedTab === tab.title}
            />
        ));
    };

    const buildButtons = (dirty, submitting, reset) => {
        return view !== VIEWS.VIEW ? (
            <>
                <Button
                    type="submit"
                    className="nexus-c-dynamic-form__submit-button"
                    appearance="primary"
                    isDisabled={!dirty || submitting}
                >
                    Save changes
                </Button>
                <Button
                    className="nexus-c-dynamic-form__cancel-button"
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
                className="nexus-c-dynamic-form__edit-button"
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
                        <div ref={containerRef} className="nexus-c-dynamic-form__tab-container">
                            {buildTabs()}
                        </div>
                        <div className="nexus-c-dynamic-form__tab-content">
                            {schema.map(({title = '', sections = []}, index) => (
                                <Fragment key={`tab-${title}`}>
                                    {sections.map(({title: sectionTitle = '', fields = {}}) => (
                                        <Fragment key={`section-${sectionTitle}`}>
                                            <h3
                                                id={sectionTitle.split(' ')[0] + index.toString()}
                                                className="nexus-c-dynamic-form__section-title"
                                            >
                                                {sectionTitle}
                                            </h3>
                                            {buildSection(fields, getValues, view, {
                                                selectValues,
                                                initialData,
                                                setFieldValue,
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
};

NexusDynamicForm.defaultProps = {
    initialData: {},
    onSubmit: undefined,
    isEdit: false,
    selectValues: {},
    containerRef: null,
};

export default NexusDynamicForm;
