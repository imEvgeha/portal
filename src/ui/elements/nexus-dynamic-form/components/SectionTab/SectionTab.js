import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {TABS_MAPPINGS} from '../../constants';
import './SectionTab.scss';

const SectionTab = ({section = '', isActive = false, onClick = null, sectionId}) => {
    const [anchorTarget, setAnchorTarget] = useState(null);

    useEffect(() => {
        setAnchorTarget(document.getElementById(mapSectionTabToTitle(section)));
    }, [section]);

    const handleClick = event => {
        event.preventDefault();
        onClick && onClick();
        anchorTarget.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    const mapSectionTabToTitle = tabName => {
        const tabMappingsWithId = TABS_MAPPINGS.map((item, index) => {
            return {
                ...item,
                id: item.tabName.split(' ')[0] + index.toString(),
            };
        });
        const sectionID = tabMappingsWithId.find(e => e.tabName === tabName).id;
        return sectionID || '';
    };

    return (
        <a
            href={`#${sectionId}`}
            id={`nav-${mapSectionTabToTitle(section)}`}
            onClick={handleClick}
            className={classnames('nexus-c-section-tab', {
                'nexus-c-section-tab--is-active': isActive,
            })}
        >
            {section}
        </a>
    );
};

SectionTab.propTypes = {
    section: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    sectionId: PropTypes.string.isRequired,
};

SectionTab.defaultProps = {
    onClick: null,
};

export default SectionTab;
