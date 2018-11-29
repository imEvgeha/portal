import t from 'prop-types';
import React from 'react';
import '../../containers/dashboard/components/DashboardCard.scss';
import DatePicker from 'react-datepicker/es';
import moment from 'moment';
import {validateDate} from '../../util/Validation';
import NexusDatePicker from './NexusDatePicker';

const INVALID_DATE = 'Invalid Date';

export default class RangeDatapicker extends React.Component {
    static propTypes = {
        fromDate: t.any,
        toDate: t.any,
        displayName: t.string,
        disabled: t.bool,
        onFromDateChange: t.func,
        onToDateChange: t.func,
        onValidate: t.func,
        setClearHandler: t.func,
        handleKeyPress: t.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            invalidStartDate: '',
            invalidEndDate: '',
            prevFromDate: null,
            prevToDate: null,
        };
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
    }

    handleChangeStartDate(date) {
        this.props.onFromDateChange(date);
        this.wrongDateRange(date && this.props.toDate && this.props.toDate < date);
        this.setState({invalidStartDate: ''});
        if (!this.state.invalidEndDate) {
            this.props.onValidate(false);
        }
    }

    handleChangeEndDate(date) {
        this.props.onToDateChange(date);
        this.wrongDateRange(date && this.props.fromDate && this.props.fromDate > date);
        this.setState({invalidEndDate: ''});
        if (!this.state.invalidStartDate) {
            this.props.onValidate(false);
        }
    }

    wrongDateRange(wrong) {
        const invalid = wrong ? this.props.displayName + ' from should be before to date' : '';
        this.setState({invalidRange: invalid});
        this.props.onValidate(invalid);
    }

    handleInvalid(name, value) {
        if (value) {
            this.setState({['invalid' + name +'Date']: INVALID_DATE, invalidRange: ''});
            this.props.onValidate(true);
        } else {
            this.setState({['invalid' + name +'Date']: ''});
        }
    }

    render() {
        return (
            <div style={{ maxWidth:'300px', minWidth:'300px', flex:'1 1 300px', margin:'0 10px'}}>
                <label htmlFor="dashboard-avails-search-start-date-text">{this.props.displayName}</label>
                <div className={'row justify-content-around'}>
                    <div style={{width: '45%', paddingLeft: '8px'}}>
                        <NexusDatePicker
                            id="dashboard-avails-search-start-date-text"
                            date={this.props.fromDate}
                            onChange={this.handleChangeStartDate}
                            onInvalid={(value) => {this.handleInvalid('Start', value);}}
                            disabled={this.props.disabled}
                            customInput={<input onKeyPress={this.props.handleKeyPress} />}
                        />
                        {this.state.invalidStartDate && <small className="text-danger m-2"
                                                               style={{bottom: '-9px'}}>{this.state.invalidStartDate}</small>}

                    </div>
                    <div>_</div>
                    <div style={{width: '45%', paddingRight: '8px'}}>
                        <NexusDatePicker
                            id="dashboard-avails-search-end-date-text"
                            date={this.props.toDate}
                            onChange={this.handleChangeEndDate}
                            onInvalid={(value) => {this.handleInvalid('End', value);}}
                            disabled={this.props.disabled}
                            customInput={<input onKeyPress={this.props.handleKeyPress} />}
                        />
                        {this.state.invalidEndDate && <small className="text-danger m-2"
                                                               style={{bottom: '-9px'}}>{this.state.invalidEndDate}</small>}
                    </div>
                    {this.state.invalidRange && <small className="text-danger m-2"
                                                                                   style={{bottom: '-9px'}}>{this.state.invalidRange}</small>}
                </div>
            </div>
        );
    }
}
