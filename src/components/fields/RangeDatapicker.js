import t from 'prop-types';
import React from 'react';
import '../../containers/dashboard/components/DashboardCard.scss';
import NexusDatePicker from './NexusDatePicker';
import {INVALID_DATE} from '../../constants/messages';
import moment from 'moment';

export default class RangeDatapicker extends React.Component {
    static propTypes = {
        fromDate: t.any,
        toDate: t.any,
        displayName: t.string,
        disabled: t.bool,
        onFromDateChange: t.func,
        onToDateChange: t.func,
        onValidate: t.func,
        handleKeyPress: t.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            invalidStartDate: '',
            invalidEndDate: '',
            prevFromDate: null,
            prevToDate: null,
            invalidRange: ''
        };
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
    }

    componentDidUpdate() {
        if (this.props.fromDate && this.props.toDate && moment(this.props.fromDate) > moment(this.props.toDate)) {
            if (!this.state.invalidRange) {
                this.wrongDateRange(true);
            }
        } else {
            if (this.state.invalidRange) {
                this.wrongDateRange(false);
            }
        }
    }

    handleChangeStartDate(date) {
        this.props.onFromDateChange(date);
        this.setState({invalidStartDate: ''});
        if (!this.state.invalidEndDate) {
            this.props.onValidate(false);
        }
    }

    handleChangeEndDate(date) {
        if (date) {
            date.set({hour:23, minute:59});
        }
        this.props.onToDateChange(date);
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
