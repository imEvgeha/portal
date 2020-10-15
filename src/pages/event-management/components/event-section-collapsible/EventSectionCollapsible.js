import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import './EventSectionCollapsible.scss';

const EventSectionCollapsible = ({title, isInitiallyOpen, header, children}) => {
    const [isOpened, setIsOpened] = useState(isInitiallyOpen);
    const toggleSection = () => setIsOpened(!isOpened);

    return (
        <div className="nexus-c-event-section-collapsible">
            <div className="nexus-c-event-section-collapsible__header">
                <div className="nexus-c-event-section-collapsible__activator" onClick={toggleSection}>
                    {isOpened ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    {title}
                </div>
                {header}
            </div>
            <div
                className={`nexus-c-event-section-collapsible__content
                ${isOpened ? 'nexus-c-event-section-collapsible__content--active' : ''}`}
            >
                {children}
            </div>
        </div>
    );
};

EventSectionCollapsible.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    header: PropTypes.element,
    isInitiallyOpen: PropTypes.bool,
};

EventSectionCollapsible.defaultProps = {
    title: null,
    header: null,
    isInitiallyOpen: true,
};

export default EventSectionCollapsible;
