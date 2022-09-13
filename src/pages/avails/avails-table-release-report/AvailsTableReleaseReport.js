import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Dropdown, OverlayPanel} from '@portal/portal-components';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {exportService} from '../../legacy/containers/avail/service/ExportService';
import {RIGHTS_TAB, STATUS_TAB} from '../rights-repository/constants';
import {CREATE_REPORT, END_YEAR, MOCK_YEAR, MONTHS, NEW_RELEASE_REPORT, START_YEAR} from './constants';
import './AvailsTableReleaseReport.scss';

const AvailsTableReleaseReport = ({activeTab}) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
    const [selectedYear, setSelectedYear] = useState(+moment().format('YYYY'));
    const op = useRef(null);

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
                // Close overlay panel
                op?.current?.hide?.();
            })
            .catch(error => {
                setIsLoading(false);
                // Close overlay panel
                op?.current?.hide?.();
                dispatch(
                    addToast({
                        detail: `${error?.type}: failed to create report. ${
                            error.message ? `Details: ${error.message}` : ''
                        }`,
                        severity: 'error',
                    })
                );
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
                <div className="row mb-1">
                    <div className="col-12">
                        <Dropdown
                            id="ddlYears"
                            value={selectedYear}
                            filter={true}
                            className="nexus-c-right-repository-release-report__year-dropdown"
                            columnClass="col-12"
                            options={getYears()}
                            placeholder="Select one option"
                            appendTo="self"
                            onChange={e => setSelectedYear(e.value)}
                        />
                    </div>
                </div>
                <div className="row mb-1">
                    <div className="col-12">
                        <Dropdown
                            id="ddlMonths"
                            value={selectedMonth}
                            filter={true}
                            className="nexus-c-right-repository-release-report__month-dropdown"
                            columnClass="col-12"
                            options={MONTHS.map(m => ({value: m, label: m}))}
                            placeholder="Select one option"
                            appendTo="self"
                            onChange={e => setSelectedMonth(e.value)}
                        />
                    </div>
                </div>
                <div className="row mb-1">
                    <div className="col-12">
                        <Button
                            label={CREATE_REPORT}
                            loading={isLoading}
                            className="p-button-outlined"
                            onClick={onCreateReport}
                        />
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="nexus-c-right-repository-release-report">
            <Button
                id="nexus-c-right-repository-release-report__popup"
                icon="po po-expand-section"
                iconPos="right"
                disabled={[STATUS_TAB].includes(activeTab)}
                className="p-button-outlined p-button-secondary"
                label={NEW_RELEASE_REPORT}
                onClick={e => op?.current?.toggle?.(e)}
            />

            <OverlayPanel ref={op} id="opReport" style={{width: 'auto'}} className="report-overlay-panel">
                <div className="row">
                    <div className="col-12 text-center">{getContent()}</div>
                </div>
            </OverlayPanel>
        </div>
    );
};

AvailsTableReleaseReport.propTypes = {
    activeTab: PropTypes.string,
};

AvailsTableReleaseReport.defaultProps = {
    activeTab: RIGHTS_TAB,
};

export default AvailsTableReleaseReport;
