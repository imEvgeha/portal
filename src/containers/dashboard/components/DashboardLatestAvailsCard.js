import React from 'react';
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';

import {historyService} from '../../avail-ingest-history/HistoryService';
import {advancedHistorySearchHelper} from '../../avail-ingest-history/AdvancedHistorySearchHelper';

import './DashboardLatestAvailsCard.scss';

import LoadingElipsis from '../../../img/ajax-loader.gif';

const REFRESH_INTERVAL = 5*1000; //5 seconds

export default class DashboardLatestAvailsCard extends React.Component {

    table = null;

    constructor(props) {
        super(props);

        this.getData = this.getData.bind(this);

        this.state = {
            pageSize: 6,
            cols:[{headerName: 'Date', field: 'received', valueFormatter: function(params) {
                          if(params.data && params.data.createdAt) return moment(params.data.received).format('L') + ' ' + moment(params.data.received).format('HH:mm');
                          else return '';
                      }, width:120},
                    {headerName: 'Provider', field: 'provider', width:90},
                    {headerName: 'Status', field: 'status', cellRendererFramework: this.statusIconRender, width:55},
                    {headerName: 'Ingest Method', field: 'ingestType', width:105},
                    {headerName: 'Filename', tooltip: this.showFileNames, valueFormatter: this.showFileNames, width:180}
            ]
        };

        this.getData();
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
                     case 'PENDING':
                        return <img style={{width:'11px'}} src={LoadingElipsis}/>;
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
        params.data.attachments.forEach( attachment => {
            let filename = attachment.link.split(/(\\|\/)/g).pop();
            switch (attachment.type) {
                case 'Excel':
                    toReturn += filename + ', ';
                    break;
            }
        });
        toReturn = toReturn.slice(0, -2);
        return toReturn;
    }

    getData() {
        setTimeout(this.getData, REFRESH_INTERVAL);
        historyService.advancedSearch(advancedHistorySearchHelper.prepareAdvancedHistorySearchCall({}), 0, this.state.pageSize, [{id: 'createdAt', desc:true}])
                .then(response => {
                    //console.log(response);
                    if(this.table){
                        this.table.api.setRowData(response.data.data);
                        this.table.api.hideOverlay();
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
                    Most Recent Avails
                    <span style={{float:'right', textDecoration: 'underline', paddingRight: '5px'}}>
                        <a href='/avail-ingest-history'>View All</a>
                    </span>
                </div>
                <div className="ag-theme-balham"
                    style={{
                        height: 'calc(100% - 26px)',
                        width: '100%' }}
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