import React from 'react';
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';
import {Link} from 'react-router-dom';

import {historyService} from '../../service/HistoryService';
import {advancedHistorySearchHelper} from '../../ingest-history/AdvancedHistorySearchHelper';

import './DashboardLatestAvailsCard.scss';

import LoadingElipsis from '../../../../img/ajax-loader.gif';

const REFRESH_INTERVAL = 5*1000; //5 seconds

export default class DashboardLatestAvailsCard extends React.Component {

    table = null;

    constructor(props) {
        super(props);

        this.getData = this.getData.bind(this);

        this.state = {
            pageSize: 6,
            cols:[{headerName: 'Date', field: 'received', valueFormatter: function(params) {
                          if(params.data && params.data.received) return moment(params.data.received).format('L') + ' ' + moment(params.data.received).format('HH:mm');
                          else return '';
                      }, width:120},
                    {headerName: 'Provider', field: 'provider', width:90},
                    {headerName: 'Status', field: 'status', cellRendererFramework: this.statusIconRender, width:55},
                    {headerName: 'Ingest Method', field: 'ingestType', width:105},
                    {headerName: 'Filename', tooltip: this.showFileNames, valueFormatter: this.showFileNames, width:180}
            ]
        };

        this.refresh = null;
    }

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

    statusIconRender(params){
        const content = params.valueFormatted || params.value;
        if (params.value !== undefined) {
            if (content) {
                switch (content) {
                     case 'COMPLETED':
                        return <span style={{ color: 'green'}}><i className="fas fa-check-circle"></i></span>;
                     case 'FAILED':
                        return <span title={params.data.errorDetails} style={{ color: 'red'}}><i className="fas fa-exclamation-circle"></i></span>;
                    case 'MANUAL':
                        return <span style={{ color: 'gold'}}><i className="fas fa-circle"> </i></span>;
                     case 'PENDING':
                        return <img style={{width:'22px'}} src={LoadingElipsis}/>;
                     default:
                        return content;
                 }
            }
            else return '';
        } else {
            return '';
        }
    }

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

    getData() {
        historyService.advancedSearch(advancedHistorySearchHelper.prepareAdvancedHistorySearchCall({}), 0, this.state.pageSize, [{id: 'received', desc:true}])
                .then(response => {
                    //console.log(response);
                    if(this.table){
                        if(response.data.total > 0){
                            this.table.api.setRowData(response.data.data);
                            this.table.api.hideOverlay();
                        }else{
                            this.table.api.showNoRowsOverlay();
                        }
                    }
                }).catch((error) => {
                   console.error('Unexpected error');
                   console.error(error);
               });
    }

    setTable = element => {
        this.table = element;
        if(this.table){
           this.table.api.showLoadingOverlay();
        }
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
                        columnDefs= {this.state.cols}
                        headerHeight= '30'
                        rowHeight= '23'
                        suppressDragLeaveHidesColumns= {true}
                        enableColResize= {false}
                        enableSorting= {false}
                        suppressHorizontalScroll= {true}
                        suppressMovableColumns = {true}
                        suppressRowClickSelection = {true}
                        suppressCellSelection = {true}
                    />
                </div>
             </div>
        );
    }
}