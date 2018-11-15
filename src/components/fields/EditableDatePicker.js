import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import t from 'prop-types';
<<<<<<< HEAD
import { validateDate } from '../../util/Validation';
=======
import {validateDate} from '../../util/Validation';
>>>>>>> 57b03f8f55f5b484625263fc34f493f460828782

class EditableDatePicker extends Component {

    static propTypes = {
        validate: t.func,
        value: t.string,
        displayName: t.string,
        name: t.string,
        onChange: t.func,
    };

    constructor(props) {
        let vodDate = props.value;
        super(props);
        this.state = {
            date: vodDate ? vodDate : moment(),
            datePickerStatus: false,
            errorMessage: '',
            submitStatus: false,
            prevDate: vodDate
        };

        this.handleShowDatePicker = this.handleShowDatePicker.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleCancelDatePicker = this.handleCancelDatePicker.bind(this);
        this.handleDatepickerRawChange = this.handleDatepickerRawChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleShowDatePicker(e) {
        e.preventDefault();
        this.setState({
            datePickerStatus: true,
            date: moment(this.state.date).isValid() ? moment(this.state.date) : moment(),
        });
    }
    handleCancelDatePicker(e) {
        e.preventDefault();
        let date = moment(this.props.value);
        let newPrevDate = date;
        this.setState({
            date: newPrevDate,
            datePickerStatus: false,
        });
    }

    handleChangeDate(date) {
        this.setState({ date: date, submitStatus: false, errorMessage: '' });
    }

    handleDatepickerRawChange(date) {
        if (validateDate(date) || !date) {
            this.handleChangeDate(date);
        } else {
            this.setState({ errorMessage: 'Invalid date: ' + this.props.displayName, submitStatus: true });
        }
    }

    submit(date) {
        let validationError = this.props.validate(date);
        if (validationError !== undefined) {
            this.setState({
                errorMessage: validationError
            });
        } else {
            this.props.onChange(date);
            this.setState({
                datePickerStatus: false
            });
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.datePickerStatus ?
                        <div>
                            <div className="dPicker">
                                <DatePicker
                                    className={this.state.errorMessage ? 'text-danger' : ''}
                                    placeholderText="Enter date"
                                    selected={moment(this.state.date)}
                                    showYearDropdown
                                    showMonthDropdown
                                    autoComplete={'off'}
                                    onChangeRaw={(event) => this.handleDatepickerRawChange(event.target.value)}
                                    onChange={this.handleChangeDate}
                                    todayButton={'Today'} />
                            </div>
                            <div style={{ float: 'left' }}>
                                <Button
                                    className="dPButton"
                                    disabled={this.state.submitStatus}
                                    onClick={() => this.submit(this.state.date)}
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
                                <p style={{ color: 'red' }}>
                                    <br />
                                    <br />
                                    {this.state.errorMessage}
                                </p>
                            }
                        </div>
                        :
                        this.props.value ?
                            <span
                                onClick={this.handleShowDatePicker}
                                className="displayDate">
                                {moment(this.state.date).format('L')}
                            </span>
                            :
                            <span
                                style={{ color: '#808080', cursor: 'pointer' }}
                                onClick={this.handleShowDatePicker}>
                                {'Enter ' + this.props.displayName}
                            </span>
                }
<<<<<<< HEAD
=======

>>>>>>> 57b03f8f55f5b484625263fc34f493f460828782
            </div>
        );
    }
}

export default EditableDatePicker;
