import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Constants from './Constants';

const AuditHistoryTable = ({data}) => {
    const [auditData, setAuditData] = useState(false);
    const [columnDefs, setColumnDefs] = useState([]);

    useEffect(() => {
        if(data.eventHistory && data.eventHistory.length){
            const columns = columnDefs.map(key => ({
                field: key,
                headerName: displayName,
                colId: id,
            }));
            setColumnDefs(columns);
            setAuditData(true);
        }
    }, [data]);

    return (
        auditData && (
            <div>Audit History Table</div>
        )
    );
};

AuditHistoryTable.propTypes = {
    data: PropTypes.object,
};

AuditHistoryTable.defaultProps = {
    data: {
        eventHistory: [],
        diff: [],
    },
};

export default AuditHistoryTable;