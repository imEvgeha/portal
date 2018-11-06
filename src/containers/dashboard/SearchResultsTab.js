import './DashboardContainer.scss';

import React from 'react';
import {alertModal} from '../../components/share/AlertModal';
import {confirmModal} from '../../components/share/ConfirmModal';
import t from 'prop-types';
import AvailsResultTable from './components/AvailsResultTable';
import connect from 'react-redux/es/connect/connect';
import {dashboardService} from './DashboardService';
import {profileService} from './ProfileService';

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        availTabPageSelected: state.session.availTabPageSelected,
        reportName: state.session.reportName,
    };
};

class SearchResultsTab extends React.Component {

    static propTypes = {
        availTabPage: t.object,
        availTabPageSelected: t.array,
        reportName: t.string,
        onBackToDashboard: t.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            reportsName:profileService.getReportsNames()
        };
        this.requestFile = this.requestFile.bind(this);
    }
    //
    // componentDidMount() {
    //     profileService.getReportsNames();
    // }

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
        dashboardService.downloadAvails(this.props.availTabPageSelected)
        .then(function (response) {
            console.log('avails received');

            //header containing filename sugestion is not accesible by javascript by default, aditional changes on server required
            //for now we recreate the filename using the same syntax as server
            const currentTime = new Date();
            let filename = 'avails_';
            filename += currentTime.getFullYear() + '_' + (currentTime.getMonth() + 1) + '_' + currentTime.getDate() + '_';
            filename += currentTime.getHours() + '_' + currentTime.getMinutes() + '_' + currentTime.getSeconds();
            filename += '.xlsx';

            const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/octet-stream'}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            link.click();
            window.URL.revokeObjectURL(url);
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
            profileService.changeReport(reportName);
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
                        this.state.reportsName.map((reportName) => (<option key={reportName} value={reportName}>{reportName}</option>))
                    }
                </select>
            );
        };

        return (
            <div id="dashboard-result-table">
                <div className={'container-fluid'}>
                    <div className="row justify-content-between">
                        <div className="col-4 align-bottom">
                            <span className="table-top-text" id={'dashboard-result-number'} style={{paddingTop: '10px'}}>
                                Results: {this.props.availTabPage.total}
                            </span>
                            {this.selectedItemsComponent()}
                        </div>
                        <div className="d-inline-flex align-content-center" style={{whiteSpace: 'nowrap'}}>
                            <span className="align-self-center" >Selected report:</span>
                            {renderReportSelect()}
                        </div>
                        <div className="col-2">
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