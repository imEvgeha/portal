import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './SectionTab.scss';

const SectionTab = ({
    section = '',
    isActive = false,
    onClick = null,
}) => {
    const [anchorTarget, setAnchorTarget] = useState(null);

    useEffect(() => {
        setAnchorTarget(document.getElementById(section));
    }, [section]);

    const handleClick = event => {
        event.preventDefault();
        onClick && onClick();
        anchorTarget.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    return (
        <a
            href={`#${section}`}
            onClick={handleClick}
            className={classnames(
                'nexus-c-section-tab',
                {
                    'nexus-c-section-tab--is-active': isActive,
                }
            )}
        >
            {section}
        </a>
    )
}

SectionTab.propTypes = {
    section: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
}

SectionTab.defaultProps = {
    onClick: null,
}

export default SectionTab;
