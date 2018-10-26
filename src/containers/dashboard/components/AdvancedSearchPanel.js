import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {Button} from 'reactstrap';
import {searchFormUpdateSearchCriteria} from '../../../actions/dashboard';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';

const mapDispatchToProps = {
    searchFormUpdateSearchCriteria
};

const INVALID_DATE = 'Invalid Date';
const INVALID_RANGE = 'Start date should be before end date';

class AdvancedSearchPanel extends React.Component {
    static propTypes = {
        onSearch: t.func,
        searchFormUpdateSearchCriteria: t.func,
        onToggleAdvancedSearch: t.func,
        hide: t.bool
    };

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            searchCriteria: {
                vodStart: null,
                vodEnd: null,
                title: '',
                studio: ''
            },
            invalidStartDate: '',
            invalidEndDate: '',
        };
        this.handleClear = this.handleClear.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.setupVodStartDate = this.setupVodStartDate.bind(this);
        this.handleChangeVodStartDate = this.handleChangeVodStartDate.bind(this);
        this.handleChangeRawVodStartDate = this.handleChangeRawVodStartDate.bind(this);
        this.setupVodEndDate = this.setupVodEndDate.bind(this);
        this.handleChangeVodEndDate = this.handleChangeVodEndDate.bind(this);
        this.handleChangeRawVodEndDate = this.handleChangeRawVodEndDate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.refDatePickerStart = React.createRef();
        this.refDatePickerEnd = React.createRef();
    }

    setupVodStartDate() {
        if (!this.state.searchCriteria.vodStart) {
            this.setState({
                searchCriteria: {...this.state.searchCriteria, vodStart: moment()}
            });
        }
    }

    handleChangeVodStartDate(date) {
        if (date) {
            this.setState({
                searchCriteria: {...this.state.searchCriteria, vodStart: date}
            });
        }
        this.wrongDateRange(date && this.state.searchCriteria.vodEnd && this.state.searchCriteria.vodEnd < date);
    }

    handleChangeRawVodStartDate(date) {
        if (moment(date).isValid()) {
            this.handleChangeVodStartDate(moment(date));
            this.setState({invalidStartDate: ''});
        } else {
            this.setState({invalidStartDate: INVALID_DATE});
        }
    }

    setupVodEndDate() {
        if (!this.state.searchCriteria.vodEnd) {
            this.setState({
                searchCriteria: {...this.state.searchCriteria, vodEnd: moment()}
            });
        }
    }

    handleChangeVodEndDate(date) {
        if (date) {
            this.setState({
                searchCriteria: {...this.state.searchCriteria, vodEnd: date}
            });
        }
        this.wrongDateRange(date && this.state.searchCriteria.vodStart && this.state.searchCriteria.vodStart > date);
    }

    wrongDateRange(wrong) {
        if (wrong) {
            this.setState({invalidStartDate: INVALID_RANGE, invalidEndDate: INVALID_RANGE});
        } else if (this.state.invalidStartDate === INVALID_RANGE && this.state.invalidEndDate === INVALID_RANGE) {
            this.setState({invalidStartDate: '', invalidEndDate: ''});
        }
    }

    handleChangeRawVodEndDate(date) {
        if (moment(date).isValid()) {
            this.handleChangeVodEndDate(moment(date));
            this.setState({invalidEndDate: ''});
        } else {
            this.setState({invalidEndDate: INVALID_DATE});
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            searchCriteria: {
                ...this.state.searchCriteria,
                [name]: value
            }
        });
    }

    handleClear() {
        this.setState({
            searchCriteria: {
                vodStart: null,
                vodEnd: null,
                studio: '',
                title: '',
                invalidStartDate: null,
                invalidEndDate: null,
            }
        });
        this.refDatePickerStart.current.clear();
        this.refDatePickerEnd.current.clear();
    }

    handleSearch() {
        this.props.searchFormUpdateSearchCriteria(this.state.searchCriteria);
        this.props.onSearch({
            ...this.state.searchCriteria,
            vodStart: this.state.searchCriteria.vodStart && this.state.searchCriteria.vodStart.format(),
            vodEnd: this.state.searchCriteria.vodEnd && this.state.searchCriteria.vodEnd.format()
        });
    }

    render() {
        return (
            <div className={'nx-stylish container-fluid vu-advanced-search-panel ' + (this.props.hide ? 'hide' : '')}
                 style={{background: 'rgba(0,0,0,0.1)', padding: '1em'}}>
                <button type="button" className="close" aria-label="Close" onClick={this.props.onToggleAdvancedSearch}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dashboard-avails-search-title-text">Title</label>
                            <input type="text" className="form-control"
                                   id="dashboard-avails-search-title-text"
                                   placeholder="Enter Title"
                                   name="title"
                                   value={this.state.searchCriteria.title}
                                   onChange={this.handleInputChange}
                                   onKeyPress={this._handleKeyPress}/>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label
                                htmlFor="dashboard-avails-search-studio-text">Studio</label>
                            <input type="text" className="form-control"
                                   id="dashboard-avails-search-studio-text"
                                   placeholder="Enter Studio"
                                   name="studio"
                                   value={this.state.searchCriteria.studio}
                                   onChange={this.handleInputChange}
                                   onKeyPress={this._handleKeyPress}/>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dashboard-avails-search-start-date-text">VOD Start</label>
                            <span onClick={this.setupVodStartDate}>
                                <DatePicker
                                    ref={this.refDatePickerStart}
                                    className={this.state.invalidStartDate ? 'text-danger' : ''}
                                    id="dashboard-avails-search-start-date-text"
                                    selected={this.state.searchCriteria.vodStart}
                                    onChange={this.handleChangeVodStartDate}
                                    onChangeRaw={(event) => this.handleChangeRawVodStartDate(event.target.value)}
                                    todayButton={'Today'}
                                />
                                {this.state.invalidStartDate && <small className="text-danger m-2"
                                                                       style={{position: 'absolute', bottom: '-9px'}}>{this.state.invalidStartDate}</small>}
                            </span>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dashboard-avails-search-end-date-text">VOD End</label>
                            <span onClick={this.setupVodEndDate}>
                                <DatePicker
                                    ref={this.refDatePickerEnd}
                                    className={this.state.invalidEndDate ? 'text-danger' : ''}
                                    id="dashboard-avails-search-end-date-text"
                                    selected={this.state.searchCriteria.vodEnd}
                                    onChange={this.handleChangeVodEndDate}
                                    onChangeRaw={(event) => this.handleChangeRawVodEndDate(event.target.value)}
                                    todayButton={'Today'}
                                />
                                {this.state.invalidEndDate && <small className="text-danger m-2"
                                                                     style={{position: 'absolute', bottom: '-9px'}}>{this.state.invalidEndDate}</small>}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-md-end">

                        <Button outline color="secondary" id={'dashboard-avails-advanced-search-clear-btn'} onClick={this.handleClear}
                                style={{width: '68px', marginRight: '10px'}}>clear</Button>

                        <Button outline color="secondary" id={'dashboard-avails-advanced-search-filter-btn'} onClick={this.handleSearch}
                                style={{width: '68px', marginRight: '60px'}}>filter</Button>

                </div>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(AdvancedSearchPanel);