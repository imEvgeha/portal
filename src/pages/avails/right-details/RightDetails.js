import React, {Fragment, useState} from 'react';
// import PropTypes from 'prop-types';
import SectionTab from './components/SectionTab';
import mapping from './structureMapping.json';
import {parseField} from './utils';
import './RightDetails.scss';

const TABS = (mapping || []).map(({title = ''}) => title);

const RightDetails = () => {
    const [selectedTab, setSelectedTab] = useState(TABS[0]);

    const buildSection = (fields = []) => {
        return (
            <>
                {fields.map(parseField)}
            </>
        )
    }

    return (
        <div className="nexus-c-right-details">
            <div className="nexus-c-right-details__tab-container">
                {TABS.map(tab => (
                    <SectionTab
                        key={tab}
                        section={tab}
                        onClick={() => setSelectedTab(tab)}
                        isActive={selectedTab === tab}
                    />
                ))}
            </div>
            <div className="nexus-c-right-details__tab-content">
                {mapping.map(({title = '', sections = []}) => (
                    <Fragment key={title}>
                        {sections.map(({title: sectionTitle = '', fields = []}) => (
                            <Fragment key={`section-${sectionTitle}`}>
                                <h3
                                    id={sectionTitle}
                                    className="nexus-c-right-details__section-title"
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
    )
};

RightDetails.propTypes = {};

RightDetails.defaultProps = {};

export default RightDetails;
