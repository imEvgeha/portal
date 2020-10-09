import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {TABS_MAPPINGS} from '../../constants';
import './SectionTab.scss';

const SectionTab = ({section = '', isActive = false, onClick = null}) => {
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
        return TABS_MAPPINGS.find(e => e.tabName === tabName).id;
    };

    return (
        <a
            href={`#${mapSectionTabToTitle(section)}`}
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
};

SectionTab.defaultProps = {
    onClick: null,
};

export default SectionTab;
