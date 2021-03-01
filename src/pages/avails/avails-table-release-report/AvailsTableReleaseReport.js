import React, {useState} from 'react';
import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';
import Select from '@atlaskit/select';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import moment from 'moment';
import {connect} from 'react-redux';
import {exportService} from '../../legacy/containers/avail/service/ExportService';
import {CREATE_REPORT, MONTHS, START_YEAR, END_YEAR, NEW_RELEASE_REPORT} from './constants';
import './AvailsTableReleaseReport.scss';

const AvailsTableReleaseReport = ({}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
    const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));

    const onCreateReport = () => {
        const monthNumber = moment().month(selectedMonth).format('MM');
        const yearMonth = `${selectedYear}-${monthNumber}`;
        const startFrom = `${yearMonth}-01T00:00:00.000`;
        const endDay = moment(yearMonth, 'YYYY-MM').daysInMonth();
        const startTo = `${yearMonth}-${endDay}T23:59:59.999`;
        setIsLoading(true);
        exportService
            .getReleaseReport({startFrom, startTo})
            .then(response => {
                downloadFile(response);
                setIsLoading(false);
                setIsOpen(false);
            })
            .catch(error => {
                setIsLoading(false);
                setIsOpen(false);
            });
    };

    const getYears = () => {
        const list = [];
        for (let i = START_YEAR; i <= END_YEAR; i++) {
            list.push({value: i, label: i});
        }
        return list;
    };

    const getContent = () => {
        return (
            <div className="nexus-c-right-repository-release-report-content">
                <Select
                    value={{value: selectedYear, label: selectedYear}}
                    className="nexus-c-right-repository-release-report__year-dropdown"
                    onChange={val => setSelectedYear(val.value)}
                    options={getYears()}
                    classNamePrefix="nexus-c-nexus-select"
                    isSearchable
                />
                <Select
                    value={{value: selectedMonth, label: selectedMonth}}
                    className="nexus-c-right-repository-release-report__month-dropdown"
                    onChange={val => setSelectedMonth(val.value)}
                    options={MONTHS.map(m => ({value: m, label: m}))}
                    classNamePrefix="nexus-c-nexus-select"
                    isSearchable
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
        );
    };
    return (
        <div className="nexus-c-right-repository-release-report">
            <Popup
                id="nexus-c-right-repository-release-report__popup"
                boundariesElement="scrollParent"
                placement="bottom-start"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                content={() => getContent()}
                trigger={triggerProps => (
                    <Button {...triggerProps} isSelected={isOpen} onClick={() => setIsOpen(!isOpen)} shouldFitContainer>
                        {NEW_RELEASE_REPORT}
                    </Button>
                )}
            />
        </div>
    );
};

export default AvailsTableReleaseReport;