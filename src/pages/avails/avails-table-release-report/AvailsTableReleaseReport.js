import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DropdownMenu from '@atlaskit/dropdown-menu';
import Select from '@atlaskit/select';
import moment from 'moment';
import {connect} from 'react-redux';
import {CREATE_REPORT, MONTHS, SELECT_MONTH, SELECT_YEAR, YEARS} from './constants';
import './AvailsTableReleaseReport.scss';

const AvailsTableReleaseReport = ({}) => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const onCreateReport = () => {
        const monthNumber = moment().month(selectedMonth).format('MM');
        console.log(monthNumber);
    };

    return (
        <div className="nexus-c-right-repository-release-report">
            <DropdownMenu className="nexus-c-button" trigger="New Release Report" triggerType="button">
                <div className="nexus-c-right-repository-release-report-content">
                    <Select
                        className="nexus-c-right-repository-release-report__year-dropdown"
                        placeholder={SELECT_YEAR}
                        onChange={val => setSelectedYear(val.value)}
                        options={YEARS.map(m => ({value: m, label: m}))}
                    />
                    <Select
                        className="nexus-c-right-repository-release-report__month-dropdown"
                        placeholder={SELECT_MONTH}
                        onChange={val => setSelectedMonth(val.value)}
                        options={MONTHS.map(m => ({value: m, label: m}))}
                    />
                    <Button
                        className="nexus-c-right-repository-release-report-content__btn"
                        onClick={onCreateReport}
                        appearance="primary"
                        shouldFitContainer
                    >
                        {CREATE_REPORT}
                    </Button>
                </div>
            </DropdownMenu>
        </div>
    );
};

AvailsTableReleaseReport.propTypes = {};

AvailsTableReleaseReport.defaultProps = {};

const mapStateToProps = () => {};

export default connect(mapStateToProps)(AvailsTableReleaseReport);
