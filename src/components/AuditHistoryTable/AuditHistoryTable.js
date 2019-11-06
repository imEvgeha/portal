import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import Constants from './Constants';
import {cellStyling, valueFormatter} from './utils';
import './AuditHistoryTable.scss';

const AuditHistoryTable = ({data, focusedRight}) => {
    const [auditData, setAuditData] = useState(false);
    const [columnDefs, setColumnDefs] = useState([]);
    const { columns, SEPARATION_ROW, HEADER_ROW } = Constants;

    useEffect(() => {
        const { eventHistory, diffs } = data;
        if(eventHistory && eventHistory.length){
            let tableRows = eventHistory.map((dataObj, index) => {
                const row = {};
                diffs[index].forEach(diff => {
                    const {op, path, value} = diff;
                    const field = path.substr(1);
                    switch(op){
                        case 'add':
                        case 'replace':
                            row[field] = value;
                            break;

                        case 'remove':
                            row[field] = value;
                            row[`${field}Deleted`] = true;
                            if(focusedRight[field] === ''){
                                row[`${field}Color`] = 'LightGreen';
                            }
                            break;

                        default:
                            break;
                    }
                });
                row.updatedBy = dataObj.updatedBy || dataObj.createdBy;
                row.lastUpdateReceivedAt = dataObj.lastUpdateReceivedAt;
                return row;
            });
            tableRows = tableRows.reverse();
            tableRows.splice(0, 0, {
                ...focusedRight,
                ...HEADER_ROW,
            }, SEPARATION_ROW);
            setAuditData(tableRows);
        }
    }, [data]);

    useEffect( () => {
        const cols = columns.map(col => ({
            colId: col.field,
            width: 100,
            valueFormatter: valueFormatter(col),
            cellStyle: params => cellStyling(params, focusedRight),
            ...col,
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