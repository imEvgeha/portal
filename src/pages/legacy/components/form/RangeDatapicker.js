import PropTypes from 'prop-types';
import React from 'react';
import NexusDatePicker from './NexusDatePicker';
import {INVALID_DATE} from '../../constants/messages';
import moment from 'moment';
import {momentToISO} from '@vubiquity-nexus/portal-utils/lib/Common';

export default class RangeDatapicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidStartDate: '',
            invalidEndDate: '',
            invalidRange: '',
        };
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.refFirstDatePicker = React.createRef();
    }

    componentDidUpdate() {
        if (
            this.props.value.from &&
            this.props.value.to &&
            moment(this.props.value.from) > moment(this.props.value.to)
        ) {
            if (!this.state.invalidRange && !this.state.invalidStartDate && !this.state.invalidEndDate) {
                this.props.onInvalid(this.wrongDateRange(true));
            }
        } else {
            if (this.state.invalidRange) {
                this.props.onInvalid(this.wrongDateRange(false));
            }
        }
    }

    handleChangeStartDate(date) {
        this.props.onFromDateChange(date ? momentToISO(date) : null);
        const invalidRange = this.wrongDateRange(date && this.props.value.to && moment(this.props.value.to) < date);
        this.setState({invalidStartDate: ''});
        this.props.onInvalid(this.state.invalidEndDate || invalidRange);
    }

    handleChangeEndDate(date) {
        this.props.onToDateChange(date ? momentToISO(date) : null);
        const invalidRange = this.wrongDateRange(date && this.props.value.from && moment(this.props.value.from) > date);
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
            this.setState({['invalid' + name + 'Date']: INVALID_DATE, invalidRange: ''});
            this.props.onInvalid(true);
        } else {
            this.setState({['invalid' + name + 'Date']: ''});
        }
    }

    focus() {
        this.refFirstDatePicker.current.focus();
    }

    render() {
        return (
            <div style={{maxWidth: '300px', minWidth: '300px', flex: '1 1 300px', margin: '0 10px'}}>
                {!this.props.hideLabel && (
                    <label htmlFor="dashboard-avails-search-start-date-text">{this.props.displayName}</label>
                )}
                <div className="row justify-content-around">
                    <div style={{width: '45%', paddingLeft: '8px'}}>
                        <NexusDatePicker
                            id={this.props.id + '-from'}
                            date={this.props.value.from !== undefined ? this.props.value.from : ''}
                            ref={this.refFirstDatePicker}
                            onChange={this.handleChangeStartDate}
                            onInvalid={value => {
                                this.handleInvalid('Start', value);
                            }}
                            disabled={this.props.disabled}
                            handleKeyPress={this.props.handleKeyPress}
                        />
                        {this.state.invalidStartDate && (
                            <small className="text-danger ml-2" style={{position: 'absolute'}}>
                                {this.state.invalidStartDate}
                            </small>
                        )}
                        {this.state.invalidRange && (
                            <small className="text-danger ml-2" style={{position: 'absolute'}}>
                                {this.state.invalidRange}
                            </small>
                        )}
                    </div>
                    <div>_</div>
                    <div style={{width: '45%', paddingRight: '8px'}}>
                        <NexusDatePicker
                            id={this.props.id + '-to'}
                            date={this.props.value.to !== undefined ? this.props.value.to : ''}
                            onChange={this.handleChangeEndDate}
                            onInvalid={value => {
                                this.handleInvalid('End', value);
                            }}
                            disabled={this.props.disabled}
                            handleKeyPress={this.props.handleKeyPress}
                        />
                        {this.state.invalidEndDate && (
                            <small className="text-danger ml-2" style={{position: 'absolute'}}>
                                {this.state.invalidEndDate}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

RangeDatapicker.propTypes = {
    id: PropTypes.string,
    value: PropTypes.object,
    displayName: PropTypes.string,
    disabled: PropTypes.bool,
    onFromDateChange: PropTypes.func,
    onToDateChange: PropTypes.func,
    onInvalid: PropTypes.func,
    handleKeyPress: PropTypes.func,
    hideLabel: PropTypes.bool,
};
