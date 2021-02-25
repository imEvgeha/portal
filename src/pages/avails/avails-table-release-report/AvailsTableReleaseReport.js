import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DropdownMenu from '@atlaskit/dropdown-menu';
import Select from '@atlaskit/select';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import moment from 'moment';
import {connect} from 'react-redux';
import {exportService} from '../../legacy/containers/avail/service/ExportService';
import {CREATE_REPORT, MONTHS, START_YEAR, END_YEAR} from './constants';
import './AvailsTableReleaseReport.scss';

const AvailsTableReleaseReport = ({}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
    const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));

    const onCreateReport = () => {
        const monthNumber = moment().month(selectedMonth).format('MM');
        const yearMonth = `${selectedYear}-${monthNumber}`;
        const startFrom = `${yearMonth}-01T00:00:00`;
        const endDay = moment(yearMonth, 'YYYY-MM').daysInMonth();
        const startTo = `${yearMonth}-${endDay}T23:59:59`;
        setIsLoading(true);
        exportService
            .getReleaseReport({startFrom, startTo})
            .then(response => {
                downloadFile(response);
                setIsLoading(false);
            })
            .catch(response => {
                setIsLoading(false);
            });
    };

    const getYears = () => {
        const list = [];
        for (let i = START_YEAR; i <= END_YEAR; i++) {
            list.push({value: i, label: i});
        }
        return list;
    };

    return (
        <div className="nexus-c-right-repository-release-report">
            <DropdownMenu className="nexus-c-button" trigger="New Release Report" triggerType="button">
                <div className="nexus-c-right-repository-release-report-content">
                    <Select
                        value={{value: selectedYear, label: selectedYear}}
                        className="nexus-c-right-repository-release-report__year-dropdown"
                        onChange={val => setSelectedYear(val.value)}
                        options={getYears()}
                        classNamePrefix="nexus-c-nexus-select"
                    />
                    <Select
                        value={{value: selectedMonth, label: selectedMonth}}
                        className="nexus-c-right-repository-release-report__month-dropdown"
                        onChange={val => setSelectedMonth(val.value)}
                        options={MONTHS.map(m => ({value: m, label: m}))}
                        classNamePrefix="nexus-c-nexus-select"
                    />
                    <Button
                        isLoading={isLoading}
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
