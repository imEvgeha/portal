import React, {Component} from 'react';
import t from 'prop-types';
import {configurationService} from '../service/ConfigurationService';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        reports: state.root.reports
    };
};
class ReportsInternal extends Component {

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

ReportsInternal.propTypes = {
    onChange: t.func,
    reportName: t.string
};
export const Reports = connect(mapStateToProps, null)(ReportsInternal);