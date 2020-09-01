import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import SectionTab from './components/SectionTab';
import './NexusDynamicForm.scss';

const NexusDynamicForm = ({
    schema = [],
}) => {
    const tabs = schema.map(({title = ''}) => title);
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    const parseField = (field = {}) => {
        const {label = '', type = ''} = field || {};

        switch(type) {
            case 'text': {
                return (
                    <div>{label}</div>
                );
            }
            default:
                return (
                    <div>Unsupported field type</div>
                );
        }
    };

    const buildSection = (fields = []) => {
        return (
            <>
                {fields.map(parseField)}
            </>
        )
    };

    return (
        <div className="nexus-c-dynamic-form">
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
                        {sections.map(({title: sectionTitle = '', fields = []}) => (
                            <Fragment key={`section-${sectionTitle}`}>
                                <h3
                                    id={sectionTitle}
                                    className="nexus-c-dynamic-form__section-title"
                                >
                                    {sectionTitle}
                                </h3>
                                {buildSection(fields)}
                            </Fragment>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

NexusDynamicForm.propTypes = {
    schema: PropTypes.array.isRequired,
};

NexusDynamicForm.defaultProps = {};

export default NexusDynamicForm;
