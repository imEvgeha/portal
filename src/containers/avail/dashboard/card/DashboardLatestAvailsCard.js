import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import isEqual from 'lodash.isequal';
import { AgGridReact } from 'ag-grid-react';
import {Link} from 'react-router-dom';
import {historyService} from '../../service/HistoryService';
import {advancedHistorySearchHelper} from '../../ingest-history/AdvancedHistorySearchHelper';
import StatusIcon from '../../components/StatusIcon';
import './DashboardLatestAvailsCard.scss';
import IngestReport from './components/IngestReport';
import Constants from './Constants';

const {REFRESH_INTERVAL, PAGE_SIZE} = Constants;

class DashboardLatestAvailsCard extends React.PureComponent {
    rowIds = [];
    table = null;
    refresh = null;

    componentDidMount() {
        this.getData();
        if(this.refresh === null){
            this.refresh = setInterval(this.getData, REFRESH_INTERVAL);
        }
    }

    componentWillUnmount() {
        if(this.refresh !== null){
            clearInterval(this.refresh);
            this.refresh = null;
        }
    }

    statusIcon = (params) => {
        const {value, valueFormatted, data: {errorDetails}} = params;
        return <StatusIcon status={valueFormatted || value} title={errorDetails} />;
    };

    columns = [{headerName: 'Date', field: 'received', valueFormatter: function(params) {
            if(params.data && params.data.received) return moment(params.data.received).format('L') + ' ' + moment(params.data.received).format('HH:mm');
            else return '';
        }, width:120},
        {headerName: 'Provider', field: 'provider', width:90},
        {headerName: 'Status', field: 'status', cellRendererFramework: this.statusIcon, width:55},
        {headerName: 'Ingest Method', field: 'ingestType', width:105},
        {
            headerName: 'Filename',
            cellRendererFramework: IngestReport,
            valueFormatter: this.showFileNames,
            width:180,
        }
    ];

    showFileNames(params){
        let toReturn='';
        if(params.data.attachments){
            params.data.attachments.forEach( attachment => {
                let filename = 'Unknown';
                if(attachment.link) {
                    filename = attachment.link.split(/(\\|\/)/g).pop();
                }
                switch (attachment.attachmentType) {
                    case 'Excel':
                        toReturn += filename + ', ';
                        break;
                }
            });
        }
        if(toReturn.length > 0) toReturn = toReturn.slice(0, -2);
        return toReturn;
    }

    getData = () => {
        historyService.advancedSearch(advancedHistorySearchHelper.prepareAdvancedHistorySearchCall({}), 0, PAGE_SIZE, [{id: 'received', desc:true}])
                .then(response => {
                    const {data: {data = []} = {}} = response;
                    if(this.table){
                        if(data.length > 0){
                            const rows = data.map(row => row.id);
                            if(!isEqual(this.rowIds, rows)){
                                this.table.api.setRowData(data);
                                this.rowIds = rows;
                                this.table.api.hideOverlay();
                            }
                        }else{
                            this.table.api.showNoRowsOverlay();
                        }
                    }
                }).catch((error) => {
                   console.error('Unexpected error');
                   console.error(error);
               });
    };

    setTable = element => {
        this.table = element;
        if(this.table){
           this.table.api.showLoadingOverlay();
        }
    };

    onSelectionChanged = ({api}) => {
        const historyId = api.getSelectedRows()[0].id;
        this.props.push(`avails/history/${historyId}`);
    };

    render() {
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
                        ref={this.setTable}
                        columnDefs= {this.columns}
                        headerHeight= '30'
                        rowHeight= '23'
                        suppressDragLeaveHidesColumns= {true}
                        suppressHorizontalScroll= {true}
                        suppressMovableColumns = {true}
                        rowSelection='single'
                        onSelectionChanged={this.onSelectionChanged}
                    />
                </div>
             </div>
        );
    }
}

DashboardLatestAvailsCard.propTypes = {
    push: PropTypes.func,
};

DashboardLatestAvailsCard.defaultProps = {
    push: () => null,
};

export default DashboardLatestAvailsCard;