import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import NexusDateTimeWindowPicker from '../../../nexus-date-and-time-elements/nexus-date-time-window-picker/NexusDateTimeWindowPicker';
import {DATEPICKER_LABELS} from '../../constants';
import './CustomDateFilter.scss';

export class CustomDateFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: {
                startDate: props.initialFilters.from || '',
                endDate: props.initialFilters.to || '',
            },
        };
    }

    onChange = dateRange => {
        if (!dateRange) { return; }
        const {filterChangedCallback} = this.props;
        const {dates = {}} = this.state;
        const {startDate, endDate} = dates;
        const keys = Object.keys(dateRange);
        if (keys.includes('startDate') && dateRange.startDate !== startDate) {
            const needUpdate = endDate ? moment(dateRange.startDate).isBefore(endDate) : true;
            this.setState(
                {
                    dates: {
                        startDate: dateRange.startDate,
                        endDate,
                    },
                },
                () => (!dateRange.startDate || needUpdate) && filterChangedCallback()
            );
        } else if (keys.includes('endDate') && dateRange.endDate !== endDate) {
            const needUpdate = startDate ? moment(dateRange.endDate).isAfter(startDate) : true;
            this.setState(
                {
                    dates: {
                        endDate: dateRange.endDate,
                        startDate,
                    },
                },
                () => (!dateRange.endDate || needUpdate) && filterChangedCallback()
            );
        }
    };

    setModel = dates => {
        this.onChange(dates);
    };

    getModel = () => {
        const {dates = {}} = this.state;
        const {startDate, endDate} = dates;
        const {colDef: {field}} = this.props;
        const fieldVariable = field;
        const {
            customDateFilterParamSuffixes: [customStartSuffix, customEndSuffix],
        } = this.props;

        return {
            type: 'range',
            filter: {
                ...(startDate && {[`${fieldVariable}${customStartSuffix || 'From'}`]: startDate}),
                ...(endDate && {[`${fieldVariable}${customEndSuffix || 'To'}`]: endDate}),
            },
        };
    };

    isFilterActive = () => {
        const {dates = {}} = this.state;
        const {startDate, endDate} = dates;
        return !!(startDate || endDate);
    };

    doesFilterPass = params => {
        const {dates = {}} = this.state;
        const {colDef} = this.props;

        const {startDate, endDate} = dates;
        const {field} = colDef;
        const fieldValue = params.data[field];

        const isAfterStartDate = startDate ? moment(fieldValue).isAfter(startDate) : true;
        const isBeforeEndDate = endDate ? moment(fieldValue).isBefore(endDate) : true;

        return isAfterStartDate && isBeforeEndDate;
    };

    render() {
        const {
            colDef: {field},
            isUsingTime,
        } = this.props;
        const {dates = {}} = this.state;
        const {startDate, endDate} = dates;

        return (
            <div className="nexus-c-custom-date-range-filter">
                <NexusDateTimeWindowPicker
                    isUsingTime={isUsingTime}
                    startDateTimePickerProps={{
                        id: `${field}-filter__from`,
                        defaultValue: startDate,
                    }}
                    endDateTimePickerProps={{
                        id: `${field}-filter__to`,
                        defaultValue: endDate,
                    }}
                    onChangeAny={this.onChange}
                    labels={DATEPICKER_LABELS}
                    allowClear={true}
                />
            </div>
        );
    }
}

CustomDateFilter.propTypes = {
    initialFilters: PropTypes.object,
    isUsingTime: PropTypes.bool,
    customDateFilterParamSuffixes: PropTypes.array,
    filterChangedCallback: PropTypes.func.isRequired,
    colDef: PropTypes.object.isRequired,
};

CustomDateFilter.defaultProps = {
    initialFilters: {},
    isUsingTime: false,
    customDateFilterParamSuffixes: [],
};

export default CustomDateFilter;
