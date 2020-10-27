import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import NexusSpinner from '../../../../../ui/elements/nexus-spinner/NexusSpinner';
import {getRightsHistory} from '../../../../avails/availsService';
import AuditHistoryTable from '../../../components/AuditHistoryTable/AuditHistoryTable';

const AuditHistory = ({selectedRights}) => {
    const [eventsHistory, setEventsHistory] = useState(null);
    useEffect(() => {
        const ids = selectedRights.map(e => e.id);
        getRightsHistory(ids).then(rightsEventHistory => {
            setEventsHistory(rightsEventHistory);
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
            return <NexusSpinner />;
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
