import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import {configurationService} from '../service/ConfigurationService';
import {connect} from 'react-redux';

class ReportsInternal extends Component {
    render() {
        const options = [
            // first option
            {
                label: this.props.reportName === '' ? 'No Report Selected' : 'Default Report',
                value: '',
            },
            ...configurationService.getReportsNames().map(reportName => ({
                label: reportName,
                value: reportName,
            })),
        ];

        return (
            <Select
                id="dashboard-avails-report-select"
                value={options.find(option => option.value === this.props.reportName)}
                options={options}
                onChange={option => this.props.onChange(option.value)}
                styles={{
                    container: styles => ({...styles, width: '200px', marginLeft: '8px'}),
                }}
            />
        );
    }
}

ReportsInternal.propTypes = {
    onChange: PropTypes.func,
    reportName: PropTypes.string,
};

const mapStateToProps = state => {
    return {
        reports: state.root.reports,
    };
};

export const Reports = connect(mapStateToProps, null)(ReportsInternal);
