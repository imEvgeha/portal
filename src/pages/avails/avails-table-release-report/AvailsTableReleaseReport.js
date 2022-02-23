import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';
import Select from '@atlaskit/select';
import AtlaskitMoreIcon from '@vubiquity-nexus/portal-assets/atlaskit-more-icon.svg';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import moment from 'moment';
import {exportService} from '../../legacy/containers/avail/service/ExportService';
import {
    PRE_PLAN_SELECTED_TAB,
    PRE_PLAN_TAB,
    RIGHTS_SELECTED_TAB,
    RIGHTS_TAB,
    SELECTED_FOR_PLANNING_TAB,
    STATUS_TAB
} from '../rights-repository/constants';
import {CREATE_REPORT, ERROR_MESSAGE, MOCK_YEAR, MONTHS, START_YEAR, END_YEAR, NEW_RELEASE_REPORT} from './constants';
import './AvailsTableReleaseReport.scss';

const AvailsTableReleaseReport = ({addToast, activeTab, selectedRows, totalRows, prePlanRightsCount, planningRightsCount}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
    const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));

    useEffect(() => {
        let disable = false;
        const isItEmptyRightsTab = [RIGHTS_TAB, RIGHTS_SELECTED_TAB].includes(activeTab) && totalRows === 0;
        const isItDisabledForCurrentTab = [PRE_PLAN_TAB, PRE_PLAN_SELECTED_TAB, SELECTED_FOR_PLANNING_TAB, STATUS_TAB].includes(activeTab);
        
        if (isItEmptyRightsTab || isItDisabledForCurrentTab) {
            disable = true
        } 
        
        setIsDisabled(disable);
    }, [activeTab, selectedRows, totalRows, prePlanRightsCount]);

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
                    summary: ERROR_MESSAGE,
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
                    <Button {...triggerProps} isSelected={isOpen} onClick={() => setIsOpen(!isOpen)} isDisabled={isDisabled} shouldFitContainer>
                        <span className="nexus-c-right-repository-release-report-button__title">{NEW_RELEASE_REPORT}</span>
                        <AtlaskitMoreIcon />
                    </Button>
                )}
            />
        </div>
    );
};

AvailsTableReleaseReport.propTypes = {
    addToast: PropTypes.func,
    activeTab: PropTypes.string,
    selectedRows: PropTypes.array.isRequired,
    totalRows: PropTypes.number.isRequired,
    prePlanRightsCount: PropTypes.number,
    planningRightsCount: PropTypes.number,
};

AvailsTableReleaseReport.defaultProps = {
    addToast: () => null,
    activeTab: RIGHTS_TAB,
    prePlanRightsCount: 0,
    planningRightsCount: 0,
};

export default withToasts(AvailsTableReleaseReport);
