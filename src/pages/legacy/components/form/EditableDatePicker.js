import React, {Component} from 'react';
import {Button} from 'reactstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import NexusDatePicker from './NexusDatePicker';
import {INVALID_DATE} from '../../constants/messages';

class EditableDatePicker extends Component {
    constructor(props) {
        const vodDate = props.value;
        super(props);
        this.state = {
            date: vodDate ? moment(vodDate) : moment(),
            showStateDate: false,
            datePickerStatus: false,
            errorMessage: '',
            submitStatus: false,
        };

        this.handleShowDatePicker = this.handleShowDatePicker.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCancelDatePicker = this.handleCancelDatePicker.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value != this.props.value) {
            this.setState({
                showStateDate: false,
                date: this.props.value ? moment(this.props.value) : moment(),
            });
        }
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
            showStateDate: false,
            datePickerStatus: false,
            errorMessage: '',
        });
    }

    handleChange(date) {
        this.setState({date: date, submitStatus: false, errorMessage: ''});
    }

    handleInvalid(invalid) {
        if (invalid) {
            this.setState({errorMessage: INVALID_DATE, submitStatus: true});
        }
    }

    submit(date) {
        const validationError = this.props.validate(date);
        if (validationError !== undefined) {
            this.setState({
                errorMessage: validationError,
            });
        } else {
            this.setState({
                datePickerStatus: false,
                showStateDate: true,
            });
            this.props.onChange(date, this.cancel);
        }
    }

    render() {
        const displayFunc = value => {
            return (
                <span
                    onClick={this.handleShowDatePicker}
                    style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        minHeight: '26px',
                    }}
                    className={'displayDate' + (this.props.disabled ? ' disabled' : '')}
                >
                    {value}
                </span>
            );
        };

        const unfocusedRender = () => {
            if (this.props.priorityDisplay) {
                return displayFunc(this.props.priorityDisplay);
            } else {
                if (this.state.showStateDate) {
                    return displayFunc(
                        this.state.date
                            ? moment(this.state.date).format('L') +
                                  (this.props.showTime ? ' ' + moment(this.state.date).format('HH:mm') : '')
                            : ''
                    );
                } else {
                    if (this.props.value) {
                        return displayFunc(
                            this.props.value
                                ? moment(this.props.value).format('L') +
                                      (this.props.showTime ? ' ' + moment(this.state.date).format('HH:mm') : '')
                                : ''
                        );
                    } else {
                        return (
                            <span
                                className="displayDate"
                                style={{color: '#808080', cursor: 'pointer', width: '100%'}}
                                onClick={this.handleShowDatePicker}
                            >
                                {this.props.disabled ? '' : 'Enter ' + this.props.displayName}
                            </span>
                        );
                    }
                }
            }
        };

        return (
            <div className="editable-container">
                {this.state.datePickerStatus ? (
                    <div>
                        <div className="dPicker" style={{marginBottom: '5px'}}>
                            <NexusDatePicker
                                id="dashboard-avails-search-start-date-text"
                                date={this.state.date}
                                onChange={this.handleChange}
                                onInvalid={this.handleInvalid}
                            />
                        </div>
                        <div style={{float: 'left'}}>
                            <Button
                                className="dPButton"
                                disabled={this.state.submitStatus}
                                onClick={() => this.submit(this.state.date)}
                                color="success"
                            >
                                <i className="fa fa-check" />
                            </Button>
                            <Button className="dPButton" onClick={this.handleCancelDatePicker} color="danger">
                                <i className="fa fa-times" />
                            </Button>
                        </div>
                        {this.state.errorMessage && (
                            <small className="text-danger m-2" style={{float: 'left', width: '100%'}}>
                                {this.state.errorMessage}
                            </small>
                        )}
                    </div>
                ) : (
                    unfocusedRender()
                )}
            </div>
        );
    }
}

EditableDatePicker.propTypes = {
    validate: PropTypes.func,
    value: PropTypes.string,
    displayName: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    priorityDisplay: PropTypes.any,
    showTime: PropTypes.bool,
};

export default EditableDatePicker;
