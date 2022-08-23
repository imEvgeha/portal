import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';
import Select from '@atlaskit/select';
import AtlaskitMoreIcon from '@vubiquity-nexus/portal-assets/atlaskit-more-icon.svg';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import moment from 'moment';
import {Button as PrimereactButton} from 'primereact/button';
import {exportService} from '../../legacy/containers/avail/service/ExportService';
import {RIGHTS_TAB, STATUS_TAB} from '../rights-repository/constants';
import {CREATE_REPORT, END_YEAR, MOCK_YEAR, MONTHS, NEW_RELEASE_REPORT, START_YEAR} from './constants';
import './AvailsTableReleaseReport.scss';

const AvailsTableReleaseReport = ({activeTab, selectedRowsCount, totalRecordsCount}) => {
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
                downloadFile(response, `${selectedMonth}-${selectedYear}-New_Release_Report_US_`);
                setIsLoading(false);
                setIsOpen(false);
            })
            .catch(error => {
                setIsLoading(false);
                setIsOpen(false);
                addToast({
                    detail: `${error?.type}: failed to create report. ${
                        error.message ? `Details: ${error.message}` : ''
                    }`,
                    severity: 'error',
                });
            });
    };

    const getYears = () => {
        const list = [];
        for (let i = START_YEAR; i <= END_YEAR; i++) {
            list.push({value: i, label: i});
        }
        list.push({value: MOCK_YEAR, label: MOCK_YEAR});
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
                <PrimereactButton
                    label={isLoading ? '' : CREATE_REPORT}
                    loading={isLoading}
                    className="w-100 p-button-outlined"
                    onClick={onCreateReport}
                />
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
                    <Button
                        {...triggerProps}
                        isSelected={isOpen}
                        onClick={() => setIsOpen(!isOpen)}
                        isDisabled={[STATUS_TAB].includes(activeTab)}
                        shouldFitContainer
                    >
                        <span className="nexus-c-right-repository-release-report-button__title">
                            {NEW_RELEASE_REPORT}
                        </span>
                        <AtlaskitMoreIcon />
                    </Button>
                )}
            />
        </div>
    );
};

AvailsTableReleaseReport.propTypes = {
    activeTab: PropTypes.string,
    selectedRowsCount: PropTypes.number.isRequired,
    totalRecordsCount: PropTypes.number.isRequired,
};

AvailsTableReleaseReport.defaultProps = {
    activeTab: RIGHTS_TAB,
};

export default AvailsTableReleaseReport;
