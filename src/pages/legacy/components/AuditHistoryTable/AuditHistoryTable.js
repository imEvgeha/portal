import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {compose} from 'redux';
import {NexusGrid} from '../../../../ui/elements/';
import Constants from './Constants';
import {cellStyling, formatData, valueFormatter} from './utils';
import './AuditHistoryTable.scss';

const AuditHistoryTableWithSideBar = compose(withSideBar({toolPanels: Constants.COLUMN_TOOL_PANEL}))(NexusGrid);

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
                const {field, colId, headerName, hide = false} = col;
                return {
                    field,
                    headerName,
                    colId: colId || field,
                    width: 155,
                    valueFormatter: valueFormatter(col),
                    cellStyle: params => cellStyling(params, focusedRight, col),
                    hide: hide,
                };
            });
            setColumnDefs(cols);
        }
    }, [columnDefs]);

    return (
        <div className="nexus-c-audit-history-table">
            <AuditHistoryTableWithSideBar columnDefs={columnDefs} rowData={auditData} />
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
