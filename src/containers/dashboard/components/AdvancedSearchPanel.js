import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {Button} from 'reactstrap';
import {searchFormUpdateSearchCriteria} from '../../../actions/dashboard';
import {validateDate} from '../../../util/Validation';
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
                availStartDate: null,
                availEndDate: null,
                title: '',
                studio: ''
            },
            invalidStartDate: '',
            invalidEndDate: '',
        };
        this.handleClear = this.handleClear.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.setupAvailStartDate = this.setupAvailStartDate.bind(this);
        this.handleChangeAvailStartDate = this.handleChangeAvailStartDate.bind(this);
        this.handleChangeRawAvailStartDate = this.handleChangeRawAvailStartDate.bind(this);
        this.setupAvailEndDate = this.setupAvailEndDate.bind(this);
        this.handleChangeAvailEndDate = this.handleChangeAvailEndDate.bind(this);
        this.handleChangeRawAvailEndDate = this.handleChangeRawAvailEndDate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.refDatePickerStart = React.createRef();
        this.refDatePickerEnd = React.createRef();
    }

    setupAvailStartDate() {
        if (!this.state.searchCriteria.availStartDate) {
            this.setState({
                searchCriteria: {...this.state.searchCriteria, availStartDate: moment()}
            });
        }
    }

    handleChangeAvailStartDate(date) {
        if (date) {
            this.setState({
                searchCriteria: {...this.state.searchCriteria, availStartDate: date}
            });
        }
        this.wrongDateRange(date && this.state.searchCriteria.availEndDate && this.state.searchCriteria.availEndDate < date);
    }

    handleChangeRawAvailStartDate(date) {
        if (moment(date).isValid()) {
            this.handleChangeAvailStartDate(moment(date));
            this.setState({invalidStartDate: ''});
        } else {
            this.setState({invalidStartDate: INVALID_DATE});
        }
    }

    setupAvailEndDate() {
        if (!this.state.searchCriteria.availEndDate) {
            this.setState({
                searchCriteria: {...this.state.searchCriteria, availEndDate: moment()}
            });
        }
    }

    handleChangeAvailEndDate(date) {
        if (date) {
            this.setState({
                searchCriteria: {...this.state.searchCriteria, availEndDate: date}
            });
        }
        this.wrongDateRange(date && this.state.searchCriteria.availStartDate && this.state.searchCriteria.availStartDate > date);
    }

    wrongDateRange(wrong) {
        if (wrong) {
            this.setState({invalidStartDate: INVALID_RANGE, invalidEndDate: INVALID_RANGE});
        } else if (this.state.invalidStartDate === INVALID_RANGE && this.state.invalidEndDate === INVALID_RANGE) {
            this.setState({invalidStartDate: '', invalidEndDate: ''});
        }
    }

    handleChangeRawAvailEndDate(value) {
        const date = this.validateDate(value);
        console.log(date);
        if (date) {
            this.handleChangeAvailEndDate(moment(date));
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
                availStartDate: null,
                availEndDate: null,
                studio: '',
                title: ''
            }
        });
        this.refDatePickerStart.current.clear();
        this.refDatePickerEnd.current.clear();
    }

    handleSearch() {
        this.props.searchFormUpdateSearchCriteria(this.state.searchCriteria);
        this.props.onSearch(this.state.searchCriteria);
    }

    render() {
        return (
            <div className="nx-stylish container-fluid"
                style={{background: 'rgba(0,0,0,0.1)', padding: '1em', marginTop: '7px'}}>
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
                            <select className="form-control"
                                id="dashboard-avails-search-studio-text"
                                placeholder="Enter Studio"
                                name="studio"
                                value={this.state.searchCriteria.studio}
                                onChange={this.handleInputChange}
                                onKeyPress={this._handleKeyPress}>
                                <option>none</option>
                                <option>Elevation Pictures</option>
                                <option>Warner Bros</option>
                                <option>Disney</option>
                                <option>CBS Films</option>
                                <option>Paramount Pictures</option>
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dashboard-avails-search-start-date-text" >Avail Start
                                Date</label>
                            <span onClick={this.setupAvailStartDate}>
                                <DatePicker
                                    ref={this.refDatePickerStart}
                                    className={this.state.invalidStartDate ? 'text-danger' : ''}
                                    id="dashboard-avails-search-start-date-text"
                                    selected={this.state.searchCriteria.availStartDate}
                                    onChange={this.handleChangeAvailStartDate}
                                    onChangeRaw={(event) => this.handleChangeRawAvailStartDate(event.target.value)}
                                    todayButton={'Today'}
                                />
                                {this.state.invalidStartDate && <small className="text-danger m-2"
                                    style={{position: 'absolute', bottom: '-9px'}}>{this.state.invalidStartDate}</small>}
                            </span>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dashboard-avails-search-end-date-text" >Avail End
                                Date</label>
                            <span onClick={this.setupAvailEndDate}>
                                <DatePicker
                                    ref={this.refDatePickerEnd}
                                    className={this.state.invalidEndDate ? 'text-danger' : ''}
                                    id="dashboard-avails-search-end-date-text"
                                    selected={this.state.searchCriteria.availEndDate}
                                    onChange={this.handleChangeAvailEndDate}
                                    onChangeRaw={(event) => this.handleChangeRawAvailEndDate(event.target.value)}
                                    todayButton={'Today'}
                                />
                                {this.state.invalidEndDate && <small className="text-danger m-2"
                                    style={{position: 'absolute', bottom: '-9px'}}>{this.state.invalidEndDate}</small>}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-md-end">
                    <div className="col col-lg-2">
                        <Button outline color="secondary" id={'dashboard-avails-advanced-search-clear-btn'} onClick={this.handleClear}>clear</Button>
                        {' '}
                        <Button outline color="secondary" id={'dashboard-avails-advanced-search-filter-btn'} onClick={this.handleSearch}>filter</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(AdvancedSearchPanel);