import './DashboardContainer.scss';

import React from 'react';
import t from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {configurationService} from '../service/ConfigurationService';
import {IfEmbedded} from '../../../util/Common';
import withColumnsReorder from '../../../components/avails/ColumnsReorderTable';
import withServerSorting from '../../../components/avails/ServerSortingTable';
import withSelection from '../../../components/common/SelectionTable';
import withRights from '../../../components/avails/ServerRightsResultsTable';
import withLocalRights, {AVAILS_SELECTION} from '../../../components/avails/LocalRightsResultsTable';
import withRedux from '../../../components/avails/SaveStateTable';
import ResultsTable from '../../../components/common/ResultsTable';
import {store} from '../../../index';
import {
    resultPageUpdateColumnsOrder,
    resultPageShowSelected,
    resultPageLoading,
    resultPageUpdate
} from '../../../stores/actions/avail/dashboard';
import RightViewHistory from '../../../avails/right-history-view/RightHistoryView';
import TableColumnCustomization from '../../../ui-elements/nexus-table-column-customization/TableColumnCustomization';
import TableDownloadRights from '../../../ui-elements/nexus-table-download-rights/TableDownload';

const RightsResultsTable = withRedux(withColumnsReorder(withSelection(withServerSorting(withRights(ResultsTable)))));
const SelectedRightsResultsTable = compose(
    withRedux,
    withColumnsReorder,
    withSelection,
    withServerSorting,
    withLocalRights(AVAILS_SELECTION))(ResultsTable);

let mapStateToProps = state => {
    return {
        showSelectedAvails: state.dashboard.showSelectedAvails,
        reportName: state.dashboard.session.reportName,
        availsMapping: state.root.availsMapping,
        avails: state.dashboard.availTabPage.avails,
    };
};

const mapDispatchToProps = {
    resultPageUpdateColumnsOrder,
    resultPageShowSelected
};

class SearchResultsTab extends React.Component {

    static propTypes = {
        reportName: t.string,
        availsMapping: t.object,
        resultPageUpdateColumnsOrder: t.func,
        resultPageShowSelected: t.func,
        showSelectedAvails: t.bool,
        avails: t.array
    };

    constructor(props) {
        super(props);
        this.state = {
            reportsName:configurationService.getReportsNames(),
        };
        this.toggleShowSelected = this.toggleShowSelected.bind(this);
        this.handleChangeReport = this.handleChangeReport.bind(this);
    }

    storeData = (response) => {
        store.dispatch(resultPageLoading(false));
        let updatedResult = {
            pages: 0,
            avails: [],
            pageSize: 1,
            total: 0
        };

        if(response && response.data){
            updatedResult.pages = response.data.page + 1;
            updatedResult.pageSize = response.data.data.length;
            updatedResult.total = response.data.total;
            if(response.data.page === 0) {
                updatedResult.avails = response.data.data;
            } else {
                updatedResult.avails = [...this.props.avails, ...response.data.data];
            }
        }

        store.dispatch(resultPageUpdate(updatedResult));
    }

    toggleShowSelected(){
        this.props.resultPageShowSelected(!this.props.showSelectedAvails);
    }

    handleChangeReport(event) {
        this.props.resultPageShowSelected(false);
        const reportName = event.target.value;
        configurationService.changeReport(reportName);
    }

    updateColumnsOrder = (cols) => {
        this.props.resultPageUpdateColumnsOrder(cols);
        store.dispatch(resultPageLoading(true)); //force refresh
    }

    getSelected = () => {
        return store.getState().dashboard.session.availTabPageSelection.selected;
    }

    getColumns = () => {
        return store.getState().dashboard.session.columns;
    }

    render() {
        return (
            <div id="dashboard-result-table">
                <div className="container-fluid">
                    <div className="row justify-content-between" style={{paddingTop: '16px'}}>
                        <div className="align-bottom" style={{marginLeft: '15px'}}>
                            <span className="table-top-text" id="dashboard-result-number" style={{paddingTop: '10px'}}>
                                Results: <Total />
                            </span>
                            <Selected toggleShowSelected={this.toggleShowSelected} />
                            <RightViewHistory />
                            {this.props.showSelectedAvails && (
                                <a href="#" onClick={this.toggleShowSelected}><span
                                    className="nx-container-margin table-top-text"
                                    id="dashboard-go-to-filter"
                                                                              >Back to search
                                                                              </span>
                                </a>
                              )}
                            <Clear clearAllSelected={() => {this.clearAllSelected && this.clearAllSelected(); }} />
                        </div>
                        <div style={{marginRight: '15px'}}>
                            <IfEmbedded value={false}>
                                <div className="d-inline-flex align-content-center" style={{whiteSpace: 'nowrap', marginRight: '8px'}}>
                                    <span className="align-self-center">Selected report:</span>
                                    <Reports
                                        onChange={this.handleChangeReport}
                                        reportName={this.props.reportName}
                                    />
                                </div>
                                <TableDownloadRights
                                    getSelected={this.getSelected}
                                    getColumns={this.getColumns}
                                />
                            </IfEmbedded>
                            <TableColumnCustomization
                                availsMapping={this.props.availsMapping}
                                columns={store.getState().dashboard.session.columns}
                                updateColumnsOrder={this.updateColumnsOrder}
                            />
                        </div>
                    </div>
                    <div>
                        <RightsResultsTable
                            availsMapping={this.props.availsMapping}
                            hidden={this.props.showSelectedAvails}
                            onDataLoaded={this.storeData}
                        />
                    </div>
                    <div>
                        <SelectedRightsResultsTable
                            availsMapping={this.props.availsMapping}
                            setClearAllSelected={clearAllSelected => this.clearAllSelected = clearAllSelected}
                            hidden={!this.props.showSelectedAvails}
                            isAvailSelectedTab={true}
                        />
                    </div>

                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsTab);

import {Component} from 'react';
import {compose} from 'redux';

//--------------------------------------

mapStateToProps = state => {
    return {
        reports: state.root.reports
    };
};
class ReportsInternal extends Component {

    static propTypes = {
        reports: t.array,
        onChange: t.func,
        reportName: t.string
    };

    render(){
        return (
            <select
                className="form-control border-0 d-inline"
                id="dashboard-avails-report-select"
                onChange={this.props.onChange}
                value={this.props.reportName}
            >
                <option value="">{this.props.reportName === '' ? 'No Report Selected' : 'Default Report'}</option>
                {
                    configurationService.getReportsNames().map((reportName) => (<option key={reportName} value={reportName}>{reportName}</option>))
                }
            </select>
        );
    }
}
let Reports = connect(mapStateToProps, null)(ReportsInternal);

//--------------------------------------

mapStateToProps = state => {
    return {
        total: state.dashboard.availTabPage.total
    };
};
class TotalInternal extends Component {

    static propTypes = {
        total: t.number
    };

    render(){
        return this.props.total;
    }
}
let Total = connect(mapStateToProps, null)(TotalInternal);

//--------------------------------------

mapStateToProps = state => {
    return {
        availTabPageSelected: state.dashboard.session.availTabPageSelection.selected,
        showSelectedAvails: state.dashboard.showSelectedAvails,
    };
};
class SelectedInternal extends Component {

    static propTypes = {
        showSelectedAvails: t.bool,
        availTabPageSelected: t.array,
        toggleShowSelected: t.func
    };

    render(){
        if(this.props.showSelectedAvails){
            return (
                <span
                    className="nx-container-margin table-top-text"
                    id="dashboard-selected-avails-number"
                >Selected items: {this.props.availTabPageSelected.length}
                </span>
);
        }else {
            if (this.props.availTabPageSelected.length) {
                return (
                    <a href="#" onClick={this.props.toggleShowSelected}><span
                        className="nx-container-margin table-top-text"
                        id="dashboard-selected-avails-number"
                                                                        >Selected items: {this.props.availTabPageSelected.length}
                    </span>
                    </a>
);
            }
        }
        return '';
    }
}
let Selected = connect(mapStateToProps, null)(SelectedInternal);

//--------------------------------------

mapStateToProps = state => {
    return {
        availTabPageSelected: state.dashboard.session.availTabPageSelection.selected,
        showSelectedAvails: state.dashboard.showSelectedAvails,
    };
};
class ClearInternal extends Component {

    static propTypes = {
        showSelectedAvails: t.bool,
        availTabPageSelected: t.array,
        clearAllSelected: t.func
    };

    render(){
        if (this.props.showSelectedAvails && this.props.availTabPageSelected.length > 0)
        return (
            <a href="#" onClick={this.props.clearAllSelected}><span
                className="nx-container-margin table-top-text"
                id="dashboard-clear-all-selected"
                                                              >Clear All
            </span>
            </a>
);
        else return '';
    }
}
let Clear = connect(mapStateToProps, null)(ClearInternal);
