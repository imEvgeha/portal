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
    }

    setupAvailStartDate() {
        if (!this.state.searchCriteria.availStartDate) {
            this.setState({
                searchCriteria: {...this.state.searchCriteria, availStartDate: moment()}
            });
        }
    }

    handleChangeAvailStartDate(date) {
        this.setState({
            searchCriteria: {...this.state.searchCriteria, availStartDate: date}
        });
        this.wrongDateRange(this.state.searchCriteria.availEndDate && this.state.searchCriteria.availEndDate < date);
    }

    handleChangeRawAvailStartDate(date) {
        this.setState({invalidStartDate: !validateDate(date)});
    }

    setupAvailEndDate() {
        if (!this.state.searchCriteria.availEndDate) {
            this.setState({
                searchCriteria: {...this.state.searchCriteria, availEndDate: moment()}
            });
        }
    }

    handleChangeAvailEndDate(date) {
        console.log('Start: ' + this.state.searchCriteria.availStartDate);
        console.log('End: ' + date);
        console.log('compare: ' + this.state.searchCriteria.availStartDate > date);
        this.setState({
            searchCriteria: {...this.state.searchCriteria, availEndDate: date}
        });
        this.wrongDateRange(this.state.searchCriteria.availStartDate && this.state.searchCriteria.availStartDate > date);
    }

    wrongDateRange(wrong) {
        if (wrong) {
            this.setState({invalidStartDate: 'Wrong date range', invalidEndDate: 'Wrong date range'});
        } else {
            this.setState({invalidStartDate: '', invalidEndDate: ''});
        }
    }

    handleChangeRawAvailEndDate(date) {
        date = validateDate(date.target.value);
        if (date) {
            console.log('Valid Date: ' + date);
            console.log('moment: ' + moment(date));

            this.handleChangeAvailEndDate(moment(date));
        } else {
            this.setState({invalidEndDate: 'Invalid date'});
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
                            <label htmlFor="dashboard-avails-search-start-date-text" className={this.state.invalidStartDate ? 'text-danger' : ''}>Avail Start
                                Date</label>
                            <span onClick={this.setupAvailStartDate}>
                                <DatePicker
                                    id="dashboard-avails-search-start-date-text"
                                    selected={this.state.searchCriteria.availStartDate}
                                    onChange={this.handleChangeAvailStartDate}
                                    onChangeRaw={this.handleChangeRawAvailStartDate}
                                    todayButton={'Today'}
                                />
                                {this.state.invalidStartDate && <small className="text-danger m-2"
                                    style={{position: 'absolute', bottom: '-9px'}}>{this.state.invalidStartDate}</small>}
                            </span>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dashboard-avails-search-end-date-text" className={this.state.invalidEndDate ? 'text-danger' : ''}>Avail End
                                Date</label>
                            <span onClick={this.setupAvailEndDate}>
                                <DatePicker
                                    id="dashboard-avails-search-end-date-text"
                                    selected={this.state.searchCriteria.availEndDate}
                                    onChange={this.handleChangeAvailEndDate}
                                    onChangeRaw={this.handleChangeRawAvailEndDate}
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