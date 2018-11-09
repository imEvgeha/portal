import './DashboardContainer.scss';

import React from 'react';
import {alertModal} from '../../components/share/AlertModal';
import {confirmModal} from '../../components/share/ConfirmModal';
import t from 'prop-types';
import AvailsResultTable from './components/AvailsResultTable';
import connect from 'react-redux/es/connect/connect';
import {dashboardService} from './DashboardService';
import {configurationService} from './ConfigurationService';
import {downloadFile} from '../../util/Common';

import {
    resultPageUpdateColumnsOrder
} from '../../actions/dashboard';

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        columns: state.dashboard.columns,
        availTabPageSelected: state.session.availTabPageSelection.selected,
        reportName: state.session.reportName,
        availsMapping: state.root.availsMapping,
        columnsOrder: state.dashboard.columns
    };
};

const mapDispatchToProps = {
    resultPageUpdateColumnsOrder: resultPageUpdateColumnsOrder
};

class SearchResultsTab extends React.Component {

    static propTypes = {
        availTabPage: t.object,
        availTabPageSelected: t.array,
        columns: t.array,
        reportName: t.string,
        onBackToDashboard: t.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            reportsName:configurationService.getReportsNames(),
            hideShowColumns:{}
        };
        this.requestFile = this.requestFile.bind(this);
        this.toggleColumn = this.toggleColumn.bind(this);
        this.selectColumns = this.selectColumns.bind(this);
        this.saveColumns = this.saveColumns.bind(this);
        this.cancelColumns = this.cancelColumns.bind(this);
    }

    selectColumnsContentProvider() {
        return this.props.availsMapping.mappings.map(column => {
                let checked = this.props.columnsOrder.indexOf(column.javaVariableName) > -1 ? true : false;
                return <div key={column.javaVariableName}><input type='checkbox' name={column.javaVariableName} style={{marginRight: '8px'}} onClick={this.toggleColumn} defaultChecked={checked} />{column.displayName}<br/></div>;
            }
        );
    }

    selectColumns() {
        confirmModal.open('Select Visible Columns',
            this.saveColumns,
            this.cancelColumns,
            {confirmLabel:'Save',  description: this.selectColumnsContentProvider()});
    }

    toggleColumn(e){
        if(this.state.hideShowColumns.hasOwnProperty(e.target.name) && this.state.hideShowColumns[e.target.name] != e.target.checked){
            delete this.state.hideShowColumns[e.target.name];
        }else{
            this.state.hideShowColumns[e.target.name]=e.target.checked;
        }
    }

    saveColumns() {
        let cols = this.props.columnsOrder.slice();
        //remove all hidden columns
        Object.keys(this.state.hideShowColumns).map(key => {
            if(this.state.hideShowColumns[key]===false){
                let position = cols.indexOf(key);
                if(position>-1){
                    cols.splice(position, 1);
                }
            }
        })
        //add new visible columns
        Object.keys(this.state.hideShowColumns).map(key => {
            if(this.state.hideShowColumns[key]===true){
                let position = cols.indexOf(key);
                if(position===-1){
                    cols.push(key);
                }
            }
        })

        this.state.hideShowColumns={};
        this.props.resultPageUpdateColumnsOrder(cols);
    }

    cancelColumns() {
        this.state.hideShowColumns={};
    }

    exportAvails = () => {
        if (this.props.availTabPageSelected.length === 0) {
            alertModal.open('Action required', () => {
            }, {description: 'Please select at least one avail'});
        } else {
            confirmModal.open('Confirm download',
                this.requestFile,
                () => {
                },
                {description: `You have selected ${this.props.availTabPageSelected.length} avails for download.`});
        }
    };

    requestFile() {
        dashboardService.exportAvails(this.props.availTabPageSelected, this.props.columns)
        .then(function (response) {
            console.log('avails received');
            downloadFile(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    selectedItemsComponent() {
        if (this.props.availTabPageSelected.length) {
            return <span className={'nx-container-margin table-top-text'}
                         id={'dashboard-selected-avails-number'}>Selected items: {this.props.availTabPageSelected.length}</span>;
        }
    }

    handleChangeReport(event) {
        const reportName = event.target.value;
        if (reportName) {
            configurationService.changeReport(reportName);
        }
    }

    render() {
        const renderReportSelect = () => {
            return (
                <select className="form-control border-0 d-inline"
                        id={'dashboard-avails-report-select'}
                        onChange={this.handleChangeReport}
                        value={this.props.reportName}>
                    <option value="">None selected</option>
                    {
                        configurationService.getReportsNames().map((reportName) => (<option key={reportName} value={reportName}>{reportName}</option>))
                    }
                </select>
            );
        };

        return (
            <div id="dashboard-result-table">
                <div className={'container-fluid'}>
                    <div className="row justify-content-between" style={{paddingTop: '16px'}}>
                        <div className="align-bottom" style={{marginLeft: '15px'}}>
                            <span className="table-top-text" id={'dashboard-result-number'} style={{paddingTop: '10px'}}>
                                Results: {this.props.availTabPage.total}
                            </span>
                            {this.selectedItemsComponent()}
                        </div>
                        <div  style={{marginRight: '15px'}}>
                            <div className="d-inline-flex align-content-center" style={{whiteSpace: 'nowrap', marginRight: '8px'}}>
                                <span className="align-self-center" >Selected report:</span>
                                {renderReportSelect()}
                            </div>
                            <i className={'fas fa-download table-top-icon float-right'} onClick={this.exportAvails}> </i>
                            <i className={'fas fa-th table-top-icon float-right'} onClick={this.selectColumns}> </i>
                        </div>
                    </div>
                    <AvailsResultTable/>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsTab);