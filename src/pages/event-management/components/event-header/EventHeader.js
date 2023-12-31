import React, {useState} from 'react';
import PropTypes from 'prop-types';
import DateTimeRenderer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-time-context/NexusDateTimeRenderer';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import {get, startCase} from 'lodash';
import {uid} from 'react-uid';
import {EVENT_HEADER_MAIN_FIELDS, EVENT_HEADER_SECONDARY_FIELDS} from '../../eventManagementConstants';
import './EventHeader.scss';

const EventHeader = ({event}) => {
    const [isSecondaryHidden, setIsSecondaryHidden] = useState(true);

    const generateEventFields = (event, fields) =>
        fields.map((fieldName, index) => {
            if (event[fieldName] && typeof event[fieldName] === 'string') {
                return (
                    <div className="nexus-c-event-header__field" key={uid(event[fieldName], index)}>
                        <div className="nexus-c-event-header__field-label">{startCase(fieldName)}</div>
                        <div className="nexus-c-event-header__field-value">
                            {!['createdTimeStamp', 'postedTimeStamp'].includes(fieldName) ? (
                                get(event, fieldName)
                            ) : (
                                <DateTimeRenderer value={get(event, fieldName)} format={DATETIME_FIELDS.TIMESTAMP}>
                                    {value => <p>{value}</p>}
                                </DateTimeRenderer>
                            )}
                        </div>
                    </div>
                );
            }
            return '';
        });

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
                {isSecondaryHidden ? 'More...' : 'Less...'}
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
