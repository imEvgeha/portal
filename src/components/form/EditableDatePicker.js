import React, { Component } from 'react';
import { Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import t from 'prop-types';
import NexusDatePicker from './NexusDatePicker';
import {INVALID_DATE} from '../../constants/messages';

class EditableDatePicker extends Component {

    static propTypes = {
        validate: t.func,
        value: t.string,
        displayName: t.string,
        disabled: t.bool,
        onChange: t.func,
        priorityDisplay: t.any
    };

    constructor(props) {
        const vodDate = props.value;
        super(props);
        this.state = {
            date: vodDate ? moment(vodDate) : moment(),
            datePickerStatus: false,
            errorMessage: '',
            submitStatus: false
        };

        this.handleShowDatePicker = this.handleShowDatePicker.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCancelDatePicker = this.handleCancelDatePicker.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    handleShowDatePicker(e) {
        e.preventDefault();
        if (!this.props.disabled) {
            this.setState({
                datePickerStatus: true,
                date: moment(this.state.date).isValid() ? moment(this.state.date) : moment(),
            });
        }
    }
    handleCancelDatePicker(e) {
        e.preventDefault();
        this.cancel();
    }

    cancel() {
        this.setState({
            date: moment(this.props.value),
            datePickerStatus: false,
            errorMessage: ''
        });
    }

    handleChange(date) {
        this.setState({ date: date, submitStatus: false, errorMessage: '' });
    }

    handleInvalid(invalid) {
        if (invalid) {
            this.setState({ errorMessage: INVALID_DATE, submitStatus: true });
        }
    }

    submit(date) {
        const validationError = this.props.validate(date);
        if (validationError !== undefined) {
            this.setState({
                errorMessage: validationError
            });
        } else {
            this.props.onChange(date, this.cancel);
            this.setState({
                datePickerStatus: false
            });
        }
    }

    render() {
        const displayFunc = (value)=>{
            return (<span
                       onClick={this.handleShowDatePicker}
                       className={'displayDate' + (this.props.disabled ? ' disabled' : '')}>
                       {value}
                   </span>);
        };

        const unfocusedRender = ()=>{
            if(this.props.priorityDisplay) {
                return displayFunc(this.props.priorityDisplay);
            } else {
                if(this.props.value) {
                    return displayFunc(this.state.date ? moment(this.state.date).format('L') : '');
                } else {
                    return(
                        <span
                            style={{ color: '#808080', cursor: 'pointer' }}
                            onClick={this.handleShowDatePicker}>
                            {this.props.disabled ? '' : 'Enter ' + this.props.displayName}
                        </span>
                    );
                }
            }
        };

        return (
            <div>
                {
                    this.state.datePickerStatus ?
                        <div>
                            <div className="dPicker" style={{ marginBottom: '5px' }}>
                                <NexusDatePicker
                                    id="dashboard-avails-search-start-date-text"
                                    date={this.state.date}
                                    onChange={this.handleChange}
                                    onInvalid={this.handleInvalid}
                                />
                            </div>
                            <div style={{ float: 'left' }}>
                                <Button
                                    className="dPButton"
                                    disabled={this.state.submitStatus}
                                    onClick={() => this.submit(this.state.date ? this.state.date.toISOString() : null)}
                                    color="success"><FontAwesome name='check' />
                                </Button>
                                <Button
                                    className="dPButton"
                                    onClick={this.handleCancelDatePicker}
                                    color="danger"><FontAwesome name='times' />
                                </Button>
                            </div>
                            {
                                this.state.errorMessage &&
                                <p style={{ color: 'red', float: 'left', width: '100%' }}>
                                    {this.state.errorMessage}
                                </p>
                            }
                        </div>
                        :
                        unfocusedRender()
                }
            </div>
        );
    }
}

export default EditableDatePicker;
