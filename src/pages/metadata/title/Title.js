import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import EditorialMetadata from './editorial-metadata/EditorialMetadata';
import TitleHeader from './title-header/TitleHeader';
import {
    METADATA_TITLE_TITLE_SECTION,
    METADATA_TITLE_CAST_N_CREW_SECTION,
    METADATA_TITLE_RATINGS_SECTION,
    METADATA_TITLE_EXTERNAL_IDS_SECTION,
    METADATA_TITLE_EDITORIAL_SECTION,
    METADATA_TITLE_TERRITORIAL_SECTION,
    METADATA_TITLE_RIGHTS_SECTION,
    METADATA_TITLE_SYNC_LOG_SECTION,
    METADATA_TITLE_SECTIONS,
} from './constants';
import './Title.scss';

const Title = ({coreTitleData, editorialTitleData}) => {
    const [currentSection, setCurrentSection] = useState(METADATA_TITLE_EDITORIAL_SECTION);
    const {title, releaseYear, type} = coreTitleData || {};

    const renderSection = section => {
        switch (section) {
            case METADATA_TITLE_TITLE_SECTION:
                return null;
            case METADATA_TITLE_CAST_N_CREW_SECTION:
                return null;
            case METADATA_TITLE_RATINGS_SECTION:
                return null;
            case METADATA_TITLE_EXTERNAL_IDS_SECTION:
                return null;
            case METADATA_TITLE_EDITORIAL_SECTION:
                return <EditorialMetadata data={editorialTitleData} />;
            case METADATA_TITLE_TERRITORIAL_SECTION:
                return null;
            case METADATA_TITLE_RIGHTS_SECTION:
                return null;
            case METADATA_TITLE_SYNC_LOG_SECTION:
                return null;
            default:
                return null;
        }
    };

    return (
        <div className="nexus-c-metadata-title">
            <TitleHeader title={title} releaseYear={releaseYear} type={type} />
            <div className="nexus-c-metadata-title__sections-menu">
                {METADATA_TITLE_SECTIONS.map((section, index) => (
                    <div
                        className={classNames(
                            'nexus-c-metadata-title__section-tab',
                            section === currentSection && 'nexus-c-metadata-title__section-tab--is-active'
                        )}
                        key={index}
                        onClick={() => setCurrentSection(section)}
                    >
                        {section}
                    </div>
                ))}
            </div>
            <div className="nexus-c-metadata-title__section">{renderSection(currentSection)}</div>
        </div>
    );
};

Title.propTypes = {
    coreTitleData: PropTypes.object.isRequired,
    editorialTitleData: PropTypes.array.isRequired,
};

Title.defaultProps = {};

export default Title;
