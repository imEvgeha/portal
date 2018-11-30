import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import t from 'prop-types';
import {validateDate} from '../../util/Validation';

class NexusDatePicker extends Component {
    static propTypes = {
        date: t.any,
        id: t.string,
        disabled: t.bool,

        onChange: t.func,
        handleKeyPress: t.func,
        onInvalid: t.func,
    };

    prevRawInput = '';
    prevDate = null;

    constructor(props) {
        super(props);
        this.state = {
            dirty: false
        };

        this.clear = this.clear.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeRaw = this.handleChangeRaw.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.setValid = this.setValid.bind(this);
        this.refDatePicker = React.createRef();
    }

    componentDidUpdate() {
        if (this.props.date === null && this.prevDate !== null) {
            this.prevDate = this.props.date;
            this.clear();
        }
        this.prevDate = this.props.date;
    }

    clear() {
        this.refDatePicker.current.clear();
        this.setState({dirty: false});
        this.prevRawInput = '';
        this.setValid(true);
    }

    handleChange(date) {
        this.props.onChange(date);
        this.setState({dirty: true});
        this.setValid(true);
    }

    handleOnBlur() {
        this.setState({dirty: true});
        if (this.refDatePicker.current.input.value && !validateDate(this.refDatePicker.current.input.value)) {
            this.setValid(false);
        }
    }

    setValid(valid) {
        this.setState({invalidDate: !valid});
        if (this.props.onInvalid) {
            this.props.onInvalid(!valid);
        }
    }

    handleChangeRaw(date) {
        if (date) {
            if (this.prevRawInput.length === 1 && date.length === 2 || this.prevRawInput.length === 4 && date.length === 5) {
                this.refDatePicker.current.input.value = this.refDatePicker.current.input.value + '/';
            }

            if (this.prevRawInput.length === 3 && date.length === 2 || this.prevRawInput.length === 6 && date.length === 5 || date.length > 10) {
                this.refDatePicker.current.input.value = this.refDatePicker.current.input.value.slice(0, -1);
                date = this.refDatePicker.current.input.value;
            }

            if (!this.state.dirty && date.length === 10 ) {
                this.setState({dirty: true});
            }

            if (validateDate(date)) {
                this.handleChange(moment(date));
            } else if (this.state.dirty) {
                this.setValid(false);
            }

        } else {
            this.handleChange(null);
            this.setState({dirty: false});
        }
        this.prevRawInput = this.refDatePicker.current.input.value;
    }

    render() {
        return (
            <DatePicker
                ref={this.refDatePicker}
                className={this.state.invalidDate ? 'text-danger' : ''}
                id={this.props.id}
                placeholderText={'MM/DD/YYYY'}
                selected={this.props.date ? moment(this.props.date) : null}
                showYearDropdown
                showMonthDropdown
                autoComplete={'off'}
                onChange={this.handleChange}
                onChangeRaw={(event) => this.handleChangeRaw(event.target.value)}
                onBlur={this.handleOnBlur}
                todayButton={'Today'}
                disabled={this.props.disabled}
                customInput={<input onKeyPress={this.props.handleKeyPress} />}
            />
        );
    }
}

export default NexusDatePicker;
