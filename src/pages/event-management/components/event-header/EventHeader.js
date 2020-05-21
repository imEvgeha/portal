import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {get, startCase} from 'lodash';
import {uid} from 'react-uid';
import {EVENT_HEADER_MAIN_FIELDS, EVENT_HEADER_SECONDARY_FIELDS} from '../../eventManagementConstants';
import './EventHeader.scss';

const EventHeader = ({event}) => {
    const [isSecondaryHidden, setIsSecondaryHidden] = useState(true);

    const generateEventFields = (event, fields) => (
        fields.map((fieldName, index) => {
            return (
                <div className="nexus-c-event-header__field" key={uid(event[fieldName], index)}>
                    <div className="nexus-c-event-header__field-label">
                        {startCase(fieldName)}
                    </div>
                    {get(event, fieldName)}
                </div>
            );
        })
    );

    return (
        <div className="nexus-c-event-header">
            {generateEventFields(event, EVENT_HEADER_MAIN_FIELDS)}
            <div
                className={`
                    nexus-c-event-header__secondary-fields 
                    ${isSecondaryHidden ? 'nexus-c-event-header__secondary-fields--is-hidden' : ''}
                `}
            >
                {!isSecondaryHidden && generateEventFields(event, EVENT_HEADER_SECONDARY_FIELDS)}
            </div>
            <div
                className="nexus-c-event-header__secondary-fields-toggle"
                onClick={() => setIsSecondaryHidden(!isSecondaryHidden)}
            >
                {isSecondaryHidden
                    ? 'More...'
                    : 'Less...'}
            </div>
        </div>
    );
};

EventHeader.defaultProps = {
    event: {},
};

EventHeader.propTypes = {
    event: PropTypes.object,
};

export default EventHeader;
