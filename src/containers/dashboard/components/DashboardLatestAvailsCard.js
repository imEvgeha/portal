import React from 'react';
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';

import {historyService} from '../../avail-ingest-history/HistoryService';
import {advancedHistorySearchHelper} from '../../avail-ingest-history/AdvancedHistorySearchHelper';

import './DashboardLatestAvailsCard.scss';

export default class DashboardLatestAvailsCard extends React.Component {

    table = null;

    constructor(props) {
        super(props);
        this.state = {
            pageSize: 6,
            cols:[{headerName: 'Date', field: 'received', valueFormatter: function(params) {
                          if(params.data && params.data.received) return moment(params.data.received).format('L');
                          else return '';
                      }, width:150},
                    {headerName: 'Provider', field: 'provider', width:120},
                    {headerName: 'Status', field: 'state', width:70},
                    {headerName: 'Ingest Method', field: 'ingestType', width:160},
                    {headerName: 'Filename', valueFormatter: this.showFileNames, width:50}
            ]
        };
        this.getData();
    }

    showFileNames(params){
        console.log(params);
        return "AAAAAAAAA";
    }

    getData() {
        historyService.advancedSearch(advancedHistorySearchHelper.prepareAdvancedHistorySearchCall({}), 0, this.state.pageSize, [{id: 'received', desc:true}])
                .then(response => {
                    console.log(response);
                    this.table.api.setRowData(response.data.data);
                    this.table.api.hideOverlay();
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
            <div className="dashboard-card-container no-padding" style={{width:"555px"}}>
                <div className="ag-theme-balham"
                    style={{
                        height: '100%',
                        width: '100%' }}
                    >
                    <AgGridReact
                        ref={this.setTable}
                        columnDefs= {this.state.cols}
                        headerHeight= '30'
                        suppressHorizontalScroll= {true}
                    />
                </div>
             </div>
        );
    }
}