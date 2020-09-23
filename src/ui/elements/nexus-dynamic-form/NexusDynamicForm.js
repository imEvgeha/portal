import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm} from '@atlaskit/form';
import {get} from 'lodash';
import NexusField from './components/NexusField';
import SectionTab from './components/SectionTab';
import {VIEWS} from './constants';
import './NexusDynamicForm.scss';

const NexusDynamicForm = ({schema = [], data, onSubmit, isEdit}) => {
    const tabs = schema.map(({title = ''}) => title);
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [view, setView] = useState(isEdit ? VIEWS.VIEW : VIEWS.CREATE);

    const getDefaultValue = (field = {}) => {
        return view === VIEWS.CREATE ? get(field, 'defaultValueCreate') : get(data, field.path);
    };

    const buildSection = (fields = {}, getValues) => {
        return (
            <>
                {Object.keys(fields).map(key => {
                    const additionalProps =
                        fields[key].type === 'boolean'
                            ? {
                                  defaultIsChecked: getDefaultValue(fields[key]),
                              }
                            : {
                                  defaultValue: getDefaultValue(fields[key]),
                              };
                    return (
                        <NexusField
                            key={key}
                            name={key}
                            view={view}
                            data={getValues()}
                            {...additionalProps}
                            {...fields[key]}
                        />
                    );
                })}
            </>
        );
    };

    return (
        <div className="nexus-c-dynamic-form">
            <AKForm
                onSubmit={values => {
                    setView(VIEWS.VIEW);
                    onSubmit(values);
                }}
            >
                {({formProps, dirty, submitting, reset, getValues}) => (
                    <form {...formProps}>
                        {view !== VIEWS.VIEW ? (
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
                        )}
                        <div className="nexus-c-dynamic-form__tab-container">
                            {tabs.map(tab => (
                                <SectionTab
                                    key={tab}
                                    section={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    isActive={selectedTab === tab}
                                />
                            ))}
                        </div>
                        <div className="nexus-c-dynamic-form__tab-content">
                            {schema.map(({title = '', sections = []}) => (
                                <Fragment key={`tab-${title}`}>
                                    {sections.map(({title: sectionTitle = '', fields = {}}) => (
                                        <Fragment key={`section-${sectionTitle}`}>
                                            <h3 id={sectionTitle} className="nexus-c-dynamic-form__section-title">
                                                {sectionTitle}
                                            </h3>
                                            {buildSection(fields, getValues)}
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
    data: PropTypes.object,
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
};

NexusDynamicForm.defaultProps = {
    data: {},
    onSubmit: undefined,
    isEdit: false,
};

export default NexusDynamicForm;
