import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import Constants from './Constants';
import {cellStyling, formatData, valueFormatter} from './utils';
import RulesEngineInfo from './components/RulesEngineInfo';
import './AuditHistoryTable.scss';

const AuditHistoryTable = ({data, focusedRight}) => {
    const [auditData, setAuditData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const { columns, SEPARATION_ROW, HEADER_ROW } = Constants;

    useEffect(() => {
        const {eventHistory = []} = data || {};
        if(!auditData.length && eventHistory.length){
            const tableRows = formatData(data);
            tableRows.splice(0, 0, {
                ...focusedRight,
                ...HEADER_ROW,
            }, SEPARATION_ROW);
            setAuditData(tableRows);
        }
    }, [data]);

    useEffect( () => {
        if(columns.length !== columnDefs.length){
            const cols = columns.map(col => {
                const { field, colId, headerName} = col;
                return {
                    field,
                    headerName,
                    colId: colId || field,
                    width: 155,
                    valueFormatter: valueFormatter(col),
                    cellStyle: params => cellStyling(params, focusedRight, col),
                    tooltipComponent: 'customTooltip',
                    tooltipValueGetter: params => params.valueFormatted,
                };
            });
            setColumnDefs(cols);
        }
    }, [columnDefs]);

    return (
        <div className='nexus-c-audit-history-table'>
            <NexusGrid
                columnDefs={columnDefs}
                rowData={auditData}
                frameworkComponents={{ customTooltip: RulesEngineInfo }}
            />
        </div>
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