import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import {get} from 'lodash';
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

    // eslint-disable-next-line react/destructuring-assignment
    isFilterDisabled = () => !(this.state.dates.startDate || this.state.dates.endDate);

    onChange = dateRange => {
        if (!dateRange) {
            return;
        }

        const {
            colDef: {field},
            customDateFilterParamSuffixes: [customStartSuffix = 'From', customEndSuffix = 'To'],
            filterChangedCallback,
        } = this.props;
        const {dates = {}} = this.state;
        const {startDate, endDate} = dates;
        const keys = Object.keys(dateRange);

        if (keys.includes('startDate') && dateRange.startDate !== startDate) {
            const needUpdate = endDate ? moment(dateRange.startDate).isBefore(endDate) : false;
            this.setState(
                {
                    dates: {
                        startDate: dateRange.startDate,
                        endDate,
                    },
                },
                () => needUpdate && filterChangedCallback()
            );
        } else if (keys.includes('endDate') && dateRange.endDate !== endDate) {
            const needUpdate = startDate ? moment(dateRange.endDate).isAfter(startDate) : false;
            this.setState(
                {
                    dates: {
                        endDate: dateRange.endDate,
                        startDate,
                    },
                },
                () => needUpdate && filterChangedCallback()
            );
        } else if (keys.includes('type') && dateRange.type === 'range' && keys.includes('filter')) {
            this.setState(
                {
                    dates: {
                        startDate: get(dateRange, ['filter', `${field}${customStartSuffix}`]),
                        endDate: get(dateRange, ['filter', `${field}${customEndSuffix}`]),
                    },
                },
                filterChangedCallback
            );
        }
    };

    setModel = dates => {
        this.onChange(dates);
    };

    getModel = () => {
        const {dates = {}} = this.state;
        const {startDate, endDate} = dates;
        const {
            colDef: {field},
        } = this.props;
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

    doesFilterPass = () => {
        const {dates = {}} = this.state;
        const {startDate, endDate} = dates;

        if (startDate && endDate) {
            if (moment(endDate).isAfter(startDate)) return false;
        }
        return true;
    };

    render() {
        const {
            colDef: {field},
            isUsingTime,
            filterChangedCallback,
        } = this.props;
        const {dates = {}} = this.state;
        const {startDate, endDate} = dates;

        return (
            <div className="nexus-c-custom-date-range-filter">
                <NexusDateTimeWindowPicker
                    isUsingTime={isUsingTime}
                    isTimestamp={field === 'createdTimeStamp'}
                    isReturningTime={false}
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
                    isClearable={true}
                />
                <div className="nexus-c-date-filter-btn">
                    <Button
                        label="Filter"
                        className="p-button-outlined"
                        disabled={!this.doesFilterPass()}
                        onClick={() => filterChangedCallback()}
                    />
                </div>
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
