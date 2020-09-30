import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PropTypes from 'prop-types';
import {validateDate} from '../../../../util/Validation';
import {store} from '../../../../index';

const FIRST_DELIMETER_POSITION = 2;
const SECOUND_DELIMETER_POSITION = 5;

class NexusDatePicker extends Component {
    prevRawInput = '';
    prevDate = null;

    constructor(props) {
        super(props);
        this.state = {
            dirty: false,
            open: false,
        };

        this.clear = this.clear.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeRaw = this.handleChangeRaw.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setValid = this.setValid.bind(this);
        this.refDatePicker = React.createRef();
    }

    toggleOpen = () => {
        if (this.state.open && this.refDatePicker.current.state.open) {
            setTimeout(() => {
                this.refDatePicker.current.setOpen(false);
            }, 10);
        }
        this.setState({open: !this.state.open});
    };

    componentDidMount() {
        this.refDatePicker.current.input.onclick = this.toggleOpen;
    }

    componentDidUpdate() {
        if (this.props.date === '') {
            this.prevDate = '';
            this.handleChange(null);
        }
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

    handleOnBlur(locale = 'en') {
        this.setState({dirty: true, open: false});
        if (this.refDatePicker.current.input.value && !validateDate(this.refDatePicker.current.input.value, locale)) {
            this.setValid(false);
        }
    }

    // Hack for fix https://github.com/Hacker0x01/react-datepicker/issues/730
    handleClickOutside() {
        this.refDatePicker.current.cancelFocusInput();
        this.refDatePicker.current.setOpen(false);
    }

    setValid(valid) {
        this.setState({invalidDate: !valid});
        if (this.props.onInvalid) {
            this.props.onInvalid(!valid);
        }
    }

    // Used by ref
    focus() {
        this.refDatePicker.current.input.focus();
    }

    handleChangeRaw(date) {
        let justDirty = false;
        if (date) {
            if (
                (this.prevRawInput.length === FIRST_DELIMETER_POSITION - 1 &&
                    date.length === FIRST_DELIMETER_POSITION) ||
                (this.prevRawInput.length === SECOUND_DELIMETER_POSITION - 1 &&
                    date.length === SECOUND_DELIMETER_POSITION)
            ) {
                this.refDatePicker.current.input.value = this.refDatePicker.current.input.value + '/';
            }

            if (
                (this.prevRawInput.length === FIRST_DELIMETER_POSITION + 1 &&
                    date.length === FIRST_DELIMETER_POSITION) ||
                (this.prevRawInput.length === SECOUND_DELIMETER_POSITION + 1 &&
                    date.length === SECOUND_DELIMETER_POSITION) ||
                date.length > 10
            ) {
                this.refDatePicker.current.input.value = this.refDatePicker.current.input.value.slice(0, -1);
                date = this.refDatePicker.current.input.value;
            }

            if (!this.state.dirty && date.length === 10) {
                this.setState({dirty: true});
                justDirty = true;
            }

            if (validateDate(date)) {
                this.handleChange(moment(date));
            } else if (this.state.dirty || justDirty) {
                this.setValid(false);
            }
        } else {
            this.handleChange(null);
            this.setState({dirty: false});
        }
        this.prevRawInput = this.refDatePicker.current.input.value;
    }

    render() {
        const {locale} = store.getState().locale;

        return (
            <DatePicker
                ref={this.refDatePicker}
                className={this.state.invalidDate ? 'text-danger' : ''}
                id={this.props.id}
                placeholderText="Enter date"
                selected={this.props.date ? moment(this.props.date) : null}
                showYearDropdown
                showMonthDropdown
                autoComplete="off"
                allowSameDay={true}
                onChange={this.handleChange}
                onChangeRaw={event => this.handleChangeRaw(event.target.value)}
                onBlur={() => this.handleOnBlur(locale)}
                todayButton="Today"
                disabled={this.props.disabled}
                customInput={<input onKeyPress={this.props.handleKeyPress} />}
                onClickOutside={this.handleClickOutside}
                locale={locale}
            />
        );
    }
}

NexusDatePicker.propTypes = {
    date: PropTypes.any,
    id: PropTypes.string,
    disabled: PropTypes.bool,

    onChange: PropTypes.func,
    handleKeyPress: PropTypes.func,
    onInvalid: PropTypes.func,
};

export default NexusDatePicker;
