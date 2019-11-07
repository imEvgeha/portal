import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import Constants from './Constants';
import {cellStyling, formatData, valueFormatter} from './utils';
import './AuditHistoryTable.scss';

const AuditHistoryTable = ({data, focusedRight}) => {
    const [auditData, setAuditData] = useState(false);
    const [columnDefs, setColumnDefs] = useState([]);
    const { columns, SEPARATION_ROW, HEADER_ROW } = Constants;

    useEffect(() => {
        if(data.eventHistory && data.eventHistory.length){
            const tableRows = formatData(data);
            tableRows.splice(0, 0, {
                ...focusedRight,
                ...HEADER_ROW,
            }, SEPARATION_ROW);
            setAuditData(tableRows);
        }
    }, [data]);

    useEffect( () => {
        const cols = columns.map(col => ({
            field: col.field,
            colId: col.colId || col.field,
            width: 100,
            valueFormatter: valueFormatter(col),
            headerName: col.headerName,
            cellStyle: params => cellStyling(params, focusedRight, col),
        }));
        setColumnDefs(cols);
    }, [columnDefs]);

    return (
        auditData && (
            <div className='nexus-c-audit-history-table'>
                <NexusGrid
                    columnDefs={columnDefs}
                    rowData={auditData}
                />
            </div>
        )
    );
};

AuditHistoryTable.propTypes = {
    data: PropTypes.object,
    focusedRight: PropTypes.object,
};

AuditHistoryTable.defaultProps = {
    data: {
        eventHistory: [],
        diff: [],
    },
    focusedRight: {},
};

export default AuditHistoryTable;