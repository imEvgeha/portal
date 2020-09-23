import React, {Fragment, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as AKForm} from '@atlaskit/form';
import {get} from 'lodash';
import NexusField from './components/NexusField';
import SectionTab from './components/SectionTab';
import {VIEWS} from './constants';
import './NexusDynamicForm.scss';

const NexusDynamicForm = ({schema = [], data, onSubmit}) => {
    const tabs = schema.map(({title = ''}) => title);
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [isEdit, setIsEdit] = useState(false);

    const buildSection = (fields = {}, getValues) => {
        return (
            <>
                {Object.keys(fields).map(key => {
                    const additionalProps =
                        fields[key].type === 'boolean'
                            ? {defaultIsChecked: get(data, fields[key].path) || fields[key].defaultValue}
                            : {defaultValue: get(data, fields[key].path) || fields[key].defaultValue};
                    return (
                        <NexusField
                            key={key}
                            name={key}
                            view={isEdit ? VIEWS.EDIT : VIEWS.VIEW}
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
            <AKForm onSubmit={values => onSubmit(values)}>
                {({formProps, dirty, submitting, reset, getValues}) => (
                    <form {...formProps}>
                        {isEdit ? (
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
                                        setIsEdit(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                className="nexus-c-dynamic-form__edit-button"
                                appearance="primary"
                                onClick={() => setIsEdit(true)}
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
};

NexusDynamicForm.defaultProps = {
    data: {},
    onSubmit: undefined,
};

export default NexusDynamicForm;
