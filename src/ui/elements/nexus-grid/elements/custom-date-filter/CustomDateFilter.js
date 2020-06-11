import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './CustomDateFilter.scss';
import NexusDateTimeWindowPicker
    from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-time-window-picker/NexusDateTimeWindowPicker';
import {DATEPICKER_LABELS} from '../../constants';
import './CustomDateFilter.scss';

export class CustomDateFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: {
                startDate: props.initialFilters.from || '',
                endDate: props.initialFilters.to || ''
            }
        };
    }

    onChange = dateRange => {
        if (!dateRange) return;
        const {filterChangedCallback} = this.props;
        const {startDate, endDate} = this.state.dates;
        const keys = Object.keys(dateRange);
        if (keys.includes('startDate') && (dateRange.startDate !== startDate)){
            const needUpdate = endDate ? moment(dateRange.startDate).isBefore(endDate) : true;
            this.setState({ dates: {
                startDate: dateRange.startDate,
                endDate
            }}, () => (!dateRange.startDate || needUpdate) && filterChangedCallback());
        } else if (keys.includes('endDate') && (dateRange.endDate !== endDate)){
            const needUpdate = startDate ? moment(dateRange.endDate).isAfter(startDate) : true;
            this.setState({ dates: {
                endDate: dateRange.endDate,
                startDate
            }}, () => (!dateRange.endDate || needUpdate) && filterChangedCallback());
        }
    };

    setModel = dates => {
        this.onChange(dates);
    };

    getModel = () => {
        const {startDate, endDate} = this.state.dates;
        return ({
            type: 'range',
            filter: {
                ...startDate && {[`${this.props.colDef.field}From`]: startDate},
                ...endDate && {[`${this.props.colDef.field}To`]: endDate}
            }
        });
    };

    isFilterActive = () => {
        const {startDate, endDate} = this.state.dates;
        return !!(startDate || endDate);
    };

    doesFilterPass = (params) => {
        const {startDate, endDate} = this.state.dates;
        const {field} = this.props.colDef;
        const fieldValue = params.data[field];
        const isAfterStartDate = startDate ? moment(fieldValue).isAfter(startDate) : true;
        const isBeforeEndDate = endDate ? moment(fieldValue).isBefore(endDate) : true;
        return isAfterStartDate && isBeforeEndDate;
    };

    render (){
        const {colDef: {field}} = this.props;
        const {startDate, endDate} = this.state.dates;

        return (
            <div className='nexus-c-custom-date-range-filter'>
                <NexusDateTimeWindowPicker
                    isUsingTime={this.props.isUsingTime}
                    startDateTimePickerProps={{
                        id:`${field}-filter__from`, defaultValue: startDate
                    }}
                    endDateTimePickerProps={{
                        id:`${field}-filter__to`, defaultValue: endDate
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
    isUsingTime: PropTypes.bool
};

CustomDateFilter.defaultProps = {
    initialFilters: {},
    isUsingTime: false
};

export default CustomDateFilter;
