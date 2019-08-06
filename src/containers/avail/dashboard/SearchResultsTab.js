import './DashboardContainer.scss';

import React from 'react';
import {alertModal} from '../../../components/modal/AlertModal';
import {confirmModal} from '../../../components/modal/ConfirmModal';
import t from 'prop-types';
import RightsResultTable from './components/RightsResultTable';
import connect from 'react-redux/es/connect/connect';
import {configurationService} from '../service/ConfigurationService';
import {downloadFile, IfEmbedded} from '../../../util/Common';

import {
    resultPageUpdateColumnsOrder,
    resultPageShowSelected
} from '../../../stores/actions/avail/dashboard';
import {exportService} from '../service/ExportService';

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        showSelectedAvails: state.dashboard.showSelectedAvails,
        columns: state.dashboard.session.columns,
        availTabPageSelected: state.dashboard.session.availTabPageSelection.selected,
        reportName: state.dashboard.session.reportName,
        availsMapping: state.root.availsMapping,
        columnsOrder: state.dashboard.session.columns
    };
};

const mapDispatchToProps = {
    resultPageUpdateColumnsOrder,
    resultPageShowSelected
};

class SearchResultsTab extends React.Component {

    static propTypes = {
        availTabPage: t.object,
        availTabPageSelected: t.array,
        columns: t.array,
        reportName: t.string,
        availsMapping: t.object,
        columnsOrder: t.array,
        resultPageUpdateColumnsOrder: t.func,
        resultPageShowSelected: t.func,
        showSelectedAvails: t.bool
    };

    hideShowColumns={};

    constructor(props) {
        super(props);
        this.state = {
            reportsName:configurationService.getReportsNames(),
        };
        this.requestFile = this.requestFile.bind(this);
        this.toggleColumn = this.toggleColumn.bind(this);
        this.toggleSelectAll = this.toggleSelectAll.bind(this);
        this.selectColumns = this.selectColumns.bind(this);
        this.saveColumns = this.saveColumns.bind(this);
        this.cancelColumns = this.cancelColumns.bind(this);
        this.toggleShowSelected = this.toggleShowSelected.bind(this);
        this.handleChangeReport = this.handleChangeReport.bind(this);
    }

    selectColumns() {
        this.props.availsMapping.mappings.forEach(column => {
            if (column.javaVariableName === 'title') return '';
            let checked = this.props.columnsOrder.indexOf(column.javaVariableName) > -1;
            const data = {
                source: column,
                hideShowColumns: this.hideShowColumns,
                onChange: () => {
                    this.toggleColumn(column.javaVariableName);
                },
                saveRefresh: (refresh) =>{
                    this.hideShowColumns[column.javaVariableName].refresh = refresh;
                }
            };

            this.hideShowColumns[column.javaVariableName] = {
                data: data,
                checked: () => checked,
                refresh: () => {},
                checkbox: <SpecialCheckbox key={column.javaVariableName} data={data}/>
            };
        });

        const dataSelectAll={
            source:{
                javaVariableName: 'selectAll',
                displayName:'Select All'
            },
            hideShowColumns: this.hideShowColumns,
            onChange: (e) => {
                this.toggleSelectAll(e);
            },
            saveRefresh: (refresh) =>{
                this.hideShowColumns[dataSelectAll.source.javaVariableName].refresh = refresh;
            }
        };

        this.hideShowColumns[dataSelectAll.source.javaVariableName] = {
            data: dataSelectAll,
            checked: () => {
                let allSelected = true;
                let hideShowColumns = this.hideShowColumns;
                for (let key in hideShowColumns) {
                    if (key === dataSelectAll.source.javaVariableName) continue;
                    allSelected = allSelected && hideShowColumns[key].checked();
                }
                return allSelected;
            },
            refresh: () => {},
            checkbox: <SpecialCheckbox key={dataSelectAll.source.javaVariableName} data={dataSelectAll}/>
        };

        const options = [this.hideShowColumns['selectAll'].checkbox];
        for (let key in this.hideShowColumns) {
            if(key === 'selectAll') continue;
            options.push(this.hideShowColumns[key].checkbox);
        }

        confirmModal.open('Select Visible Columns',
            this.saveColumns,
            this.cancelColumns,
            {confirmLabel: 'OK', description: options, scrollable:true}
        );
    }

    toggleSelectAll(e){
        let currentValue = e.target.checked;
        this.props.availsMapping.mappings.forEach(column => {
            if(column.javaVariableName === 'title') return '';
            this.hideShowColumns[column.javaVariableName].checked = () => currentValue;
            this.hideShowColumns[column.javaVariableName].refresh();
        });
    }

    toggleColumn(id){
        const checkRec = this.hideShowColumns[id];
        const currentValue = checkRec.checked();
        checkRec.checked = () => !currentValue;
        this.hideShowColumns['selectAll'].refresh();
    }

    saveColumns() {
        let cols = this.props.columnsOrder.slice();
        //remove all hidden columns
        Object.keys(this.hideShowColumns).map(key => {
            if(this.hideShowColumns[key].checked() === false){
                let position = cols.indexOf(key);
                if(position>-1){
                    cols.splice(position, 1);
                }
            }
        });
        //add new visible columns
        Object.keys(this.hideShowColumns).map(key => {
            if(this.hideShowColumns[key].checked() === true){
                let position = cols.indexOf(key);
                if(position===-1){
                    cols.push(key);
                }
            }
        });

        this.hideShowColumns={};
        this.props.resultPageUpdateColumnsOrder(cols);
    }

    cancelColumns() {
        this.hideShowColumns={};
    }

    exportAvails = () => {
        if (this.props.availTabPageSelected.length === 0) {
            alertModal.open('Action required', () => {
            }, {description: 'Please select at least one right'});
        } else {
            confirmModal.open('Confirm download',
                this.requestFile,
                () => {
                },
                {description: `You have selected ${this.props.availTabPageSelected.length} avails for download.`});
        }
    };

    requestFile() {
        exportService.exportAvails(this.props.availTabPageSelected.map(({id}) => id), this.props.columns)
        .then(function (response) {
            downloadFile(response.data);
        });
    }

    selectedItemsComponent() {
        if(this.props.showSelectedAvails){
            return <span
                className={'nx-container-margin table-top-text'}
                id={'dashboard-selected-avails-number'}>Selected items: {this.props.availTabPageSelected.length}</span>;
        }else {
            if (this.props.availTabPageSelected.length) {
                return <a href={'#'} onClick={this.toggleShowSelected}><span
                    className={'nx-container-margin table-top-text'}
                    id={'dashboard-selected-avails-number'}>Selected items: {this.props.availTabPageSelected.length}</span></a>;
            }
        }
    }

    toggleShowSelected(){
        this.props.resultPageShowSelected(!this.props.showSelectedAvails);
    }

    handleChangeReport(event) {
        this.props.resultPageShowSelected(false);
        const reportName = event.target.value;
        configurationService.changeReport(reportName);
    }

    render() {
        const renderReportSelect = () => {
            return (
                <select className="form-control border-0 d-inline"
                        id={'dashboard-avails-report-select'}
                        onChange={this.handleChangeReport}
                        value={this.props.reportName}>
                    <option value="">{this.props.reportName === '' ? 'No Report Selected' : 'Default Report'}</option>
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
                            {this.props.showSelectedAvails &&
                                <a href={'#'} onClick={this.toggleShowSelected}><span
                                    className={'nx-container-margin table-top-text'}
                                    id={'dashboard-go-to-filter'}>Back to search</span></a>
                            }
                            {this.props.showSelectedAvails && this.props.availTabPageSelected.length > 0 &&
                            <a href={'#'} onClick={() => this.clearAllSelected()}><span
                                className={'nx-container-margin table-top-text'}
                                id={'dashboard-clear-all-selected'}>Clear All</span></a>
                            }
                        </div>
                        <div  style={{marginRight: '15px'}}>
                            <IfEmbedded value={false}>
                                <div className="d-inline-flex align-content-center" style={{whiteSpace: 'nowrap', marginRight: '8px'}}>
                                    <span className="align-self-center" >Selected report:</span>
                                    {renderReportSelect()}
                                </div>
                                <i className={'fas fa-download table-top-icon float-right'} onClick={this.exportAvails}> </i>
                            </IfEmbedded>
                            <i className={'fas fa-th table-top-icon float-right'} onClick={this.selectColumns}> </i>
                        </div>
                    </div>
                    <div>
                        <RightsResultTable
                            hidden={this.props.showSelectedAvails}
                            fromServer = {true}
                        />
                    </div>
                    <div>
                        <RightsResultTable
                            setClearAllSelected={clearAllSelected => this.clearAllSelected = clearAllSelected}
                            hidden={!this.props.showSelectedAvails}
                            fromServer = {false}
                        />
                    </div>

                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsTab);

import {Component} from 'react';

class SpecialCheckbox extends Component {

    static propTypes = {
        data: t.object
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.refresh = this.refresh.bind(this);
        this.props.data.saveRefresh(this.refresh);
    }

    refresh(){
        this.setState({});
    }

    onChange(e){
        if(this.props.data.onChange){
            this.props.data.onChange(e);
        }
        this.refresh();
    }

    render(){
        const def = this.props.data.source;
        const id= def.javaVariableName;
        const dataRec = this.props.data.hideShowColumns[id];
        return(
            <div>
                <input type='checkbox' name={id} style={{marginRight: '8px'}} onChange={this.onChange} checked={dataRec.checked()} />{def.displayName}<br/>
            </div>
        );
    }
}
