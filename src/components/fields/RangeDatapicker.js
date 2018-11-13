import t from 'prop-types';
import React from 'react';
import '../../containers/dashboard/components/DashboardCard.scss';
import DatePicker from 'react-datepicker/es';
import moment from 'moment';
import {validateDate} from '../../util/Validation';

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
    };

    constructor(props) {
        super(props);
        this.state = {
            invalidStartDate: '',
            invalidEndDate: '',
            prevFromDate: null,
            prevToDate: null,
        };
        this.clear = this.clear.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.handleChangeRawStartDate = this.handleChangeRawStartDate.bind(this);
        this.handleChangeRawEndDate = this.handleChangeRawEndDate.bind(this);
        this.refDatePickerStart = React.createRef();
        this.refDatePickerEnd = React.createRef();
    }

    componentDidMount() {
        this.props.setClearHandler(this.clear);
    }

    componentDidUpdate() {
        if (!this.props.fromDate && this.state.prevFromDate) {
            this.setState({
                invalidEndDate: '',
                invalidRange: '',
                prevFromDate: this.props.fromDate,
            });
        }
        if (!this.props.toDate && this.state.prevToDate) {
            this.setState({
                invalidStartDate: '',
                invalidRange: '',
                prevToDate: this.props.toDate,
            });
        }
    }

    clear() {
        this.refDatePickerStart.current.clear();
        this.refDatePickerEnd.current.clear();
    }

    handleChangeStartDate(date) {
        if (date) {
            this.props.onFromDateChange(date);
        }
        this.wrongDateRange(date && this.props.toDate && this.props.toDate < date);
    }

    handleChangeEndDate(date) {
        if (date) {
            this.props.onToDateChange(date);
        }
        this.wrongDateRange(date && this.props.fromDate && this.props.fromDate > date);
    }

    wrongDateRange(wrong) {
        this.setState({invalidRange: wrong ? this.props.displayName + ' from should be before to' : ''});
    }

    handleChangeRawStartDate(date) {
        if (date) {
            if (validateDate(date)) {
                this.handleChangeStartDate(moment(date));
                this.setState({invalidStartDate: ''});
            } else {
                this.setState({invalidStartDate: INVALID_DATE, invalidRange: ''});

            }
        } else {
            this.setState({invalidStartDate: '', invalidRange: ''});
        }
    }

    handleChangeRawEndDate(date) {
        if (date) {
            if (validateDate(date)) {
                this.handleChangeEndDate(moment(date));
                this.setState({invalidEndDate: ''});
            } else {
                this.setState({invalidEndDate: INVALID_DATE, invalidRange: ''});
            }
        } else {
            this.setState({invalidRange: '', invalidEndDate: ''});
        }
    }

    render() {
        return (
            <div style={{ maxWidth:'300px', minWidth:'300px', flex:'1 1 300px', margin:'0 10px'}}>
                <label htmlFor="dashboard-avails-search-start-date-text">{this.props.displayName}</label>
                <div className={'row justify-content-around'}>
                    <div style={{width: '45%', paddingLeft: '8px'}}>
                        <DatePicker
                            ref={this.refDatePickerStart}
                            className={this.state.invalidStartDate ? 'text-danger' : ''}
                            id="dashboard-avails-search-start-date-text"
                            selected={this.props.fromDate}
                            showYearDropdown
                            showMonthDropdown
                            autoComplete={'off'}
                            onChange={this.handleChangeStartDate}
                            onChangeRaw={(event) => this.handleChangeRawStartDate(event.target.value)}
                            todayButton={'Today'}
                            disabled={this.props.disabled}
                        />
                        {this.state.invalidStartDate && <small className="text-danger m-2"
                                                               style={{position: 'absolute', bottom: '-9px'}}>{this.state.invalidStartDate}</small>}
                        {this.state.invalidRange && <small className="text-danger m-2"
                                                               style={{position: 'absolute', bottom: '-9px'}}>{this.state.invalidRange}</small>}
                    </div>
                    <div>_</div>
                    <div style={{width: '45%', paddingRight: '8px'}}>
                        <DatePicker
                            ref={this.refDatePickerEnd}
                            className={this.state.invalidEndDate ? 'text-danger' : ''}
                            id="dashboard-avails-search-start-date-text"
                            selected={this.props.toDate}
                            showYearDropdown
                            showMonthDropdown
                            autoComplete={'off'}
                            onChange={this.handleChangeEndDate}
                            onChangeRaw={(event) => this.handleChangeRawEndDate(event.target.value)}
                            todayButton={'Today'}
                            disabled={this.props.disabled}
                        />
                        {this.state.invalidEndDate && <small className="text-danger m-2"
                                                               style={{position: 'absolute', bottom: '-9px'}}>{this.state.invalidEndDate}</small>}
                    </div>
                </div>
            </div>
        );
    }
}
