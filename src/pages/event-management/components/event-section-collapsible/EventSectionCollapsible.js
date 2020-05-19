import React, {useState} from 'react';
import PropTypes from 'prop-types';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import HipchatChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import './EventSectionCollapsible.scss';

const EventSectionCollapsible = ({title, children, header}) => {
    const [isOpened, setIsOpened] = useState(false);
    const toggleSection = () => setIsOpened(!isOpened);

    return (
        <div className="nexus-c-event-section-collapsible">
            <div className="nexus-c-event-section-collapsible__header">
                <div className="nexus-c-event-section-collapsible__activator" onClick={toggleSection}>
                    {isOpened ? <HipchatChevronUpIcon /> : <HipchatChevronDownIcon />}
                    {title}
                </div>
                {header}
            </div>
            <div className={`nexus-c-event-section-collapsible__content
                ${isOpened ? 'nexus-c-event-section-collapsible__content--active' : ''}`}
            >
                {children}
            </div>

        </div>
    );
};

EventSectionCollapsible.propTypes = {
    title: PropTypes.string,
    header: PropTypes.element,
};

EventSectionCollapsible.defaultProps = {
    title: null,
    header: null,
};

export default EventSectionCollapsible;
