import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import NexusSpinner from '@vubiquity-nexus/portal-ui/lib/elements/nexus-spinner/NexusSpinner';
import {getRightsHistory} from '../../../../avails/availsService';
import AuditHistoryTable from '../../../components/AuditHistoryTable/AuditHistoryTable';

const AuditHistory = ({selectedRights}) => {
    const [eventsHistory, setEventsHistory] = useState(null);
    useEffect(() => {
        //instead of promise.all loop through selectedRights
        Promise.all(
            selectedRights.map(right => {
                return getRightsHistory(right.id);
            })
        ).then(responses => {
            setEventsHistory(responses);
        });
    }, [selectedRights]);

    const buildModalContent = () => {
        if (eventsHistory) {
            return (
                <div>
                    {selectedRights.map((right, index) => (
                        <AuditHistoryTable key={right.id} focusedRight={right} data={eventsHistory[index]} />
                    ))}
                </div>
            );
        } else {
            return selectedRights.map((right, index) => (
                <div key={index}>
                    <NexusSpinner />
                </div>
            ));
        }
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
