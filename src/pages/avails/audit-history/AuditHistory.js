import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {getRightsHistory} from '@vubiquity-nexus/portal-utils/lib/services/availsService';
import AuditHistoryTable from './AuditHistoryTable';

const AuditHistory = ({selectedRights}) => {
    const [eventsHistory, setEventsHistory] = useState({});
    useEffect(() => {
        selectedRights.forEach(right => {
            getRightsHistory(right.id).then(response => {
                setEventsHistory(prevState => {
                    const updatedEventsHistory = {...prevState};
                    updatedEventsHistory[right.id] = response;
                    return updatedEventsHistory;
                });
            });
        });
    }, [selectedRights]);

    const buildModalContent = () => {
        return (
            <div>
                {selectedRights.map(right => (
                    <AuditHistoryTable key={right.id} focusedRight={right} data={eventsHistory[right.id]} />
                ))}
            </div>
        );
    };

    return buildModalContent();
};

export default AuditHistory;

AuditHistory.propTypes = {
    selectedRights: PropTypes.array,
};

AuditHistory.defaultProps = {
    selectedRights: [],
};
