import t from 'prop-types';
import React from 'react';
import '../../containers/dashboard/components/DashboardCard.scss';
import NexusDatePicker from './NexusDatePicker';

const INVALID_DATE = 'Invalid Date';

export default class RangeDatapicker extends React.Component {
    static propTypes = {
        value: t.object,
        displayName: t.string,
        disabled: t.bool,
        onFromDateChange: t.func,
        onToDateChange: t.func,
        onInvalid: t.func,
        handleKeyPress: t.func,
        hideLabel: t.bool
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
        const invalidRange = this.wrongDateRange(date && this.props.value.to && this.props.value.to < date);
        this.setState({invalidStartDate: ''});
        this.props.onInvalid(this.state.invalidEndDate || invalidRange);
    }

    handleChangeEndDate(date) {
        if (date) {
            date.set({hour:23, minute:59});
        }
        this.props.onToDateChange(date);
        const invalidRange = this.wrongDateRange(date && this.props.value.from && this.props.value.from > date);
        this.setState({invalidEndDate: ''});
        this.props.onInvalid(this.state.invalidStartDate || invalidRange);
    }

    wrongDateRange(wrong) {
        const invalid = wrong ? this.props.displayName + ' from should be before to date' : '';
        this.setState({invalidRange: invalid});
        return !!invalid;
    }

    handleInvalid(name, value) {
        if (value) {
            this.setState({['invalid' + name +'Date']: INVALID_DATE, invalidRange: ''});
            this.props.onInvalid(true);
        } else {
            this.setState({['invalid' + name +'Date']: ''});
        }
    }

    render() {
        return (
            <div style={{ maxWidth:'300px', minWidth:'300px', flex:'1 1 300px', margin:'0 10px'}}>
                { !this.props.hideLabel && <label htmlFor="dashboard-avails-search-start-date-text">{this.props.displayName}</label>}
                <div className={'row justify-content-around'}>
                    <div style={{width: '45%', paddingLeft: '8px'}}>
                        <NexusDatePicker
                            id="dashboard-avails-search-start-date-text"
                            date={this.props.value.from}
                            onChange={this.handleChangeStartDate}
                            onInvalid={(value) => {this.handleInvalid('Start', value);}}
                            disabled={this.props.disabled}
                            customInput={<input onKeyPress={this.props.handleKeyPress} />}
                        />
                        {this.state.invalidStartDate && <small className="text-danger ml-2"
                                                               style={{position: 'absolute'}}>{this.state.invalidStartDate}</small>}
                        {this.state.invalidRange && <small className="text-danger ml-2"
                                                           style={{position: 'absolute'}}>{this.state.invalidRange}</small>}
                    </div>
                    <div>_</div>
                    <div style={{width: '45%', paddingRight: '8px'}}>
                        <NexusDatePicker
                            id="dashboard-avails-search-end-date-text"
                            date={this.props.value.to}
                            onChange={this.handleChangeEndDate}
                            onInvalid={(value) => {this.handleInvalid('End', value);}}
                            disabled={this.props.disabled}
                            customInput={<input onKeyPress={this.props.handleKeyPress} />}
                        />
                        {this.state.invalidEndDate && <small className="text-danger ml-2"
                                                               style={{position: 'absolute'}}>{this.state.invalidEndDate}</small>}
                    </div>
                </div>
            </div>
        );
    }
}
