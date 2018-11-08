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

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        columns: state.dashboard.columns,
        availTabPageSelected: state.session.availTabPageSelection.selected,
        reportName: state.session.reportName,
    };
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
            reportsName:configurationService.getReportsNames()
        };
        this.requestFile = this.requestFile.bind(this);
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
                            <i className={'fas fa-th table-top-icon float-right'}> </i>
                        </div>
                    </div>
                    <AvailsResultTable/>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(SearchResultsTab);