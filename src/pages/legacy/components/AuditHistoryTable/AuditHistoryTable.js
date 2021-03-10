import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {NexusGrid} from '../../../../ui/elements/';
import Constants from './Constants';
import {cellStyling, formatData, valueFormatter} from './utils';
import RulesEngineInfo from './components/RulesEngineInfo';
import './AuditHistoryTable.scss';

const AuditHistoryTable = ({data, focusedRight}) => {
    const [auditData, setAuditData] = useState(null);
    const [columnDefs, setColumnDefs] = useState([]);
    const {columns, SEPARATION_ROW, HEADER_ROW} = Constants;

    useEffect(() => {
        if (data && !auditData) {
            if (data.originalEvent) {
                const tableRows = formatData(data);
                tableRows.splice(
                    0,
                    0,
                    {
                        ...focusedRight,
                        ...HEADER_ROW,
                    },
                    SEPARATION_ROW
                );
                setAuditData(tableRows);
            } else {
                setAuditData([]);
            }
        }
    }, [data]);

    useEffect(() => {
        if (columns.length !== columnDefs.length) {
            const cols = columns.map(col => {
                const {field, colId, headerName} = col;
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
        <div className="nexus-c-audit-history-table">
            <NexusGrid
                columnDefs={columnDefs}
                rowData={auditData}
                frameworkComponents={{customTooltip: RulesEngineInfo}}
            />
        </div>
    );
};

AuditHistoryTable.propTypes = {
    data: PropTypes.object,
    focusedRight: PropTypes.object,
};

AuditHistoryTable.defaultProps = {
    data: undefined,
    focusedRight: {},
};

export default AuditHistoryTable;
