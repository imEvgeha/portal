import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm} from '@atlaskit/form';
import SectionTab from './components/SectionTab/SectionTab';
import {buildSection, getProperValues} from './utils';
import {VIEWS} from './constants';
import './NexusDynamicForm.scss';

const NexusDynamicForm = ({schema = [], initialData, onSubmit, isEdit, selectValues, containerRef}) => {
    const tabs = schema.map(({title = ''}) => title);
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [view, setView] = useState(isEdit ? VIEWS.VIEW : VIEWS.CREATE);

    const buildTabs = () => {
        return tabs.map(tab => (
            <SectionTab key={tab} section={tab} onClick={() => setSelectedTab(tab)} isActive={selectedTab === tab} />
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

    const handleOnSubmit = values => {
        setView(VIEWS.VIEW);
        const properValues = getProperValues(schema, values);
        onSubmit(properValues);
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
