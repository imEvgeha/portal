import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './CustomDateFilter.scss';
import NexusDateTimeWindowPicker
    from '../../../../nexus-date-and-time-elements/nexus-date-time-window-picker/NexusDateTimeWindowPicker';
import constants from '../../../constants';
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
        if(keys.includes('startDate') && (dateRange.startDate !== startDate)){
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
                [`${this.props.colDef.field}From`]: startDate,
                [`${this.props.colDef.field}To`]: endDate,
            }
        });
    };

    isFilterActive = () => {
        const {startDate, endDate} = this.state.dates;
        return startDate || endDate;
    };

    render (){
        const {colDef: {field}} = this.props;
        const {startDate, endDate} = this.state.dates;
        return (
            <div className='nexus-c-custom-date-range-filter'>
                <NexusDateTimeWindowPicker
                    isUsingTime={false}
                    startDateTimePickerProps={{
                        id:`${field}-filter__from`, defaultValue: startDate
                    }}
                    endDateTimePickerProps={{
                        id:`${field}-filter__to`, defaultValue: endDate
                    }}
                    onChangeAny={this.onChange}
                    labels={constants.DATEPICKER_LABELS}
                    allowClear={true}
                />
            </div>
        );
    }
}

CustomDateFilter.propTypes = {
    initialFilters: PropTypes.object,
};

CustomDateFilter.defaultProps = {
    initialFilters: {},
};

export default CustomDateFilter;
