import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import isEqual from 'lodash.isequal';
import {AgGridReact} from 'ag-grid-react';
import {Link} from 'react-router-dom';
import {useIntl} from 'react-intl';
import {historyService} from '../../service/HistoryService';
import {advancedHistorySearchHelper} from '../../ingest-history/AdvancedHistorySearchHelper';
import StatusIcon from '../../../../ui-elements/nexus-status-icon/StatusIcon';
import IngestReport from './components/IngestReport';
import {getDateFormatBasedOnLocale} from '../../../../util/Common';
import Constants from './Constants';
import './DashboardLatestAvailsCard.scss';

const {REFRESH_INTERVAL, PAGE_SIZE} = Constants;

const DashboardLatestAvailsCard = ({push}) => {
    let tableData = [];
    let table = null;
    let refresh = null;

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    // Create date placeholder based on locale
    const dateFormat = `${getDateFormatBasedOnLocale(locale)} HH:mm`;

    useEffect(() => {
        getData();
        if(refresh === null){
            refresh = setInterval(getData, REFRESH_INTERVAL);
        }
        return () => {
            if (refresh !== null) {
                clearInterval(refresh);
                refresh = null;
            }
        };
    });

    const statusIcon = (params) => {
        const {value, valueFormatted, data: {errorDetails}} = params;
        return <StatusIcon status={valueFormatted || value} title={errorDetails} />;
    };

    const showFileNames = (params) => {
        let toReturn='';
        if(params.data.attachments){
            params.data.attachments.forEach( (attachment = {}) => {
                let filename = 'Unknown';
                if(attachment.link) {
                    filename = attachment.link.split(/(\\|\/)/g).pop();
                }
                if (attachment.attachmentType === 'Excel') {
                    toReturn += filename + ', ';
                }
            });
        }
        if(toReturn.length > 0) toReturn = toReturn.slice(0, -2);
        return toReturn;
    };

    const columns = [
        {
            headerName: 'Date',
            field: 'received',
            valueFormatter: (params) => {
                if (params.data && params.data.received) {
                    return `${moment(params.data.received).format(dateFormat)}`;
                }
                else {
                    return '';
                }
            },
            width:120},
        {headerName: 'Provider', field: 'provider', width:90},
        {headerName: 'Status', field: 'status', cellRendererFramework: statusIcon, width:55},
        {headerName: 'Ingest Method', field: 'ingestType', width:105},
        {
            headerName: 'Filename',
            cellRendererFramework: IngestReport,
            valueFormatter: showFileNames,
            width:180,
        }
    ];

    const getData = () => {
        historyService.advancedSearch(
            advancedHistorySearchHelper.prepareAdvancedHistorySearchCall({}),
                0,
                PAGE_SIZE,
                [{id: 'received', desc:true}]
            ).then(response => {
                const {data: {data = []} = {}} = response;
                if(table){
                    if(data.length > 0){
                        if(!isEqual(tableData, data)){
                            table.api.setRowData(data);
                            tableData = data;
                            table.api.hideOverlay();
                        }
                    }else{
                        table.api.showNoRowsOverlay();
                    }
                }
            }).catch((error) => {
               console.error('Unexpected error');
               console.error(error);
            });
    };

    const setTable = element => {
        table = element;
        if(table){
           table.api.showLoadingOverlay();
        }
    };

    const onSelectionChanged = ({api}) => {
        const historyId = api.getSelectedRows()[0].id;
        push(`avails/history/${historyId}`);
    };

    return (
        <div className="dashboard-card-container no-padding" style={{width:'555px', height:'200px'}}>
            <div className="dashboard-card-title">
                <Link to={{ pathname: '/avails/history'}}>Latest Avails Ingests</Link>
                <span style={{float:'right', textDecoration: 'underline', paddingRight: '5px'}}>
                    <Link to={{ pathname: '/avails/history'}}>View All</Link>
                </span>
            </div>
            <div className="ag-theme-balham"
                style={{
                    height: 'calc(100% - 26px)',
                    width: '100%',
                    overflow: 'hidden'}}
                >
                <AgGridReact
                    ref={setTable}
                    columnDefs= {columns}
                    headerHeight= '30'
                    rowHeight= '23'
                    suppressDragLeaveHidesColumns= {true}
                    suppressHorizontalScroll= {true}
                    suppressMovableColumns = {true}
                    rowSelection='single'
                    onSelectionChanged={onSelectionChanged}
                />
            </div>
         </div>
    );
};

DashboardLatestAvailsCard.propTypes = {
    push: PropTypes.func,
};

DashboardLatestAvailsCard.defaultProps = {
    push: () => null,
};

export default DashboardLatestAvailsCard;