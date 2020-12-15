import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {configurationService} from '../service/ConfigurationService';
import {IfEmbedded} from '@vubiquity-nexus/portal-utils/lib/Common';
import withColumnsReorder from '../../../components/avails/ColumnsReorderTable';
import withServerSorting from '../../../components/avails/ServerSortingTable';
import withSelection from '../../../components/common/SelectionTable';
import withRights from '../../../components/avails/ServerRightsResultsTable';
import withLocalRights, {AVAILS_SELECTION} from '../../../components/avails/LocalRightsResultsTable';
import withRedux from '../../../components/avails/SaveStateTable';
import ResultsTable from '../../../components/common/ResultsTable';
import AuditHistory from './AuditHistory';
import {store} from '../../../../../index';
import {
    resultPageUpdateColumnsOrder,
    resultPageShowSelected,
    resultPageLoading,
    resultPageUpdate,
} from '../../../stores/actions/avail/dashboard';
import TableColumnCustomization from '../../../../../ui/elements/nexus-table-column-customization/TableColumnCustomization';
import TableDownloadRights from '../../../../../ui/elements/nexus-table-download-rights/TableDownload';
import {Clear} from './ClearInternal';
import {Selected} from './SelectedInternal';
import {Total} from './TotalInternal';
import {Reports} from './ReportsInternal';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import './DashboardContainer.scss';

const RightsResultsTable = withRedux(withColumnsReorder(withSelection(withServerSorting(withRights(ResultsTable)))));
const SelectedRightsResultsTable = compose(
    withRedux,
    withColumnsReorder,
    withSelection,
    withServerSorting,
    withLocalRights(AVAILS_SELECTION)
)(ResultsTable);

class SearchResultsTab extends React.Component {
    constructor(props) {
        super(props);
        this.toggleShowSelected = this.toggleShowSelected.bind(this);
        this.handleChangeReport = this.handleChangeReport.bind(this);
    }

    storeData = response => {
        store.dispatch(resultPageLoading(false));
        const updatedResult = {
            pages: 0,
            avails: [],
            pageSize: 1,
            total: 0,
        };

        if (response && response.data) {
            updatedResult.pages = response.page + 1;
            updatedResult.pageSize = response.data.length;
            updatedResult.total = response.total;
            if (response.page === 0) {
                updatedResult.avails = response.data;
            } else {
                updatedResult.avails = [...this.props.avails, ...response.data];
            }
        }

        store.dispatch(resultPageUpdate(updatedResult));
    };

    toggleShowSelected() {
        this.props.resultPageShowSelected(!this.props.showSelectedAvails);
    }

    handleChangeReport(reportName) {
        this.props.resultPageShowSelected(false);
        configurationService.changeReport(reportName);
    }

    updateColumnsOrder = cols => {
        this.props.resultPageUpdateColumnsOrder(cols);
        store.dispatch(resultPageLoading(true)); //force refresh
    };

    getSelected = () => {
        return store.getState().dashboard.session.availTabPageSelection.selected;
    };

    getColumns = () => {
        return store.getState().dashboard.session.columns;
    };

    handleViewAuditHistory = () => {
        const {selectedRights = []} = this.props;
        const {openModal, closeModal} = this.context;

        const title = `Audit History (${selectedRights.length})`;
        const actions = [
            {
                text: 'Done',
                onClick: closeModal,
            },
        ];
        openModal(<AuditHistory selectedRights={selectedRights} />, {title, width: '100%', actions});
    };

    render() {
        return (
            <div id="dashboard-result-table">
                <div className="container-fluid">
                    <div className="row justify-content-between" style={{paddingTop: '8px', paddingBottom: '8px'}}>
                        <div className="align-bottom" style={{marginLeft: '15px'}}>
                            <span className="table-top-text" id="dashboard-result-number" style={{paddingTop: '10px'}}>
                                Results: <Total />
                            </span>
                            <Selected toggleShowSelected={this.toggleShowSelected} />
                            <span className="nx-container-margin table-top-text">
                                <span onClick={this.handleViewAuditHistory}>View Audit History</span>
                            </span>
                            {this.props.showSelectedAvails && (
                                <a href="#" onClick={this.toggleShowSelected}>
                                    <span className="nx-container-margin table-top-text" id="dashboard-go-to-filter">
                                        Back to search
                                    </span>
                                </a>
                            )}
                            <Clear
                                clearAllSelected={() => {
                                    this.clearAllSelected && this.clearAllSelected();
                                    this.clearAllSelectedMainTable && this.clearAllSelectedMainTable();
                                }}
                            />
                        </div>
                        <div style={{marginRight: '15px'}}>
                            <IfEmbedded value={false}>
                                <div
                                    className="d-inline-flex align-content-center"
                                    style={{whiteSpace: 'nowrap', marginRight: '8px'}}
                                >
                                    <span className="align-self-center">Selected report:</span>
                                    <Reports onChange={this.handleChangeReport} reportName={this.props.reportName} />
                                </div>
                                <TableDownloadRights getSelected={this.getSelected} getColumns={this.getColumns} />
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
                            setClearAllSelected={clearAllSelected =>
                                (this.clearAllSelectedMainTable = clearAllSelected)
                            }
                        />
                    </div>
                    <div>
                        <SelectedRightsResultsTable
                            availsMapping={this.props.availsMapping}
                            setClearAllSelected={clearAllSelected => (this.clearAllSelected = clearAllSelected)}
                            hidden={!this.props.showSelectedAvails}
                            isAvailSelectedTab={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

SearchResultsTab.contextType = NexusModalContext;

SearchResultsTab.propTypes = {
    reportName: PropTypes.string,
    availsMapping: PropTypes.object,
    resultPageUpdateColumnsOrder: PropTypes.func,
    resultPageShowSelected: PropTypes.func,
    showSelectedAvails: PropTypes.bool,
    avails: PropTypes.array,
    selectedRights: PropTypes.array,
};

const mapStateToProps = state => {
    return {
        showSelectedAvails: state.dashboard.showSelectedAvails,
        reportName: state.dashboard.session.reportName,
        availsMapping: state.root.availsMapping,
        avails: state.dashboard.availTabPage.avails,
        selectedRights: state.dashboard.session.availTabPageSelection.selected,
    };
};

const mapDispatchToProps = {
    resultPageUpdateColumnsOrder,
    resultPageShowSelected,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsTab);
