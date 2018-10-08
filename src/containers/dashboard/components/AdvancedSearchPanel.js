import React from 'react'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {Button} from 'reactstrap';
import {dashboardUpdateSearchForm} from "../../../actions";
import connect from "react-redux/es/connect/connect";

const mapState = state => {
    return {
        dashboardSearchCriteria: state.dashboardSearchCriteria
    };
};

const mapActions = {
    dashboardUpdateSearchForm
};

class AdvancedSearchPanel extends React.Component {

    constructor (props) {
        super(props);
        this.handleClear = this.handleClear.bind(this);
        this.setupAvailStartDate = this.setupAvailStartDate.bind(this);
        this.handleChangeAvailStartDate = this.handleChangeAvailStartDate.bind(this);
        this.setupAvailEndDate = this.setupAvailEndDate.bind(this);
        this.handleChangeAvailEndDate = this.handleChangeAvailEndDate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    setupAvailStartDate() {
        if (!this.props.dashboardSearchCriteria.availStartDate) {
            this.props.dashboardUpdateSearchForm({
                availStartDate: moment()
            });
        }
    }

    handleChangeAvailStartDate(date) {
        this.props.dashboardUpdateSearchForm({
            availStartDate: date
        });
    }

    setupAvailEndDate() {
        if (!this.props.dashboardSearchCriteria.availEndDate) {
            this.props.dashboardUpdateSearchForm({
                availEndDate: moment()
            });
        }
    }

    handleChangeAvailEndDate(date) {
        this.props.dashboardUpdateSearchForm({
            availEndDate: date
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.props.dashboardUpdateSearchForm({
            [name]: value
        });
    }

    handleClear() {
        this.props.dashboardUpdateSearchForm({
            availStartDate: null,
            availEndDate: null,
            studio: '',
            title: ''
        });
    }

    render() {
        return (
            <div className="nx-stylish container-fluid"
                 style={{background: 'rgba(0,0,0,0.1)', padding: '1em'}}>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dashboard-avails-search-title-text">Title</label>
                            <input type="text" className="form-control"
                                   id="dashboard-avails-search-title-text"
                                   placeholder="Enter Title"
                                   name="title"
                                   value={this.props.dashboardSearchCriteria.title}
                                   onChange={this.handleInputChange}/>
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
                                    value={this.props.dashboardSearchCriteria.studio}
                                    onChange={this.handleInputChange}>
                                <option>none</option>
                                <option>Warner Bros</option>
                                <option>Disney</option>
                                <option>CBS Films</option>
                                <option>Paramount Pictures</option>
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dashboard-avails-search-start-date-text">Avail Start
                                Date</label>
                            <span onClick={this.setupAvailStartDate} id="dashboard-avails-search-start-date-text">
                                <DatePicker
                                    selected={this.props.dashboardSearchCriteria.availStartDate}
                                    onChange={this.handleChangeAvailStartDate}
                                />
                            </span>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dashboard-avails-search-end-date-text">Avail End
                                Date</label>
                            <span onClick={this.setupAvailEndDate} id="dashboard-avails-search-end-date-text">
                                <DatePicker
                                    selected={this.props.dashboardSearchCriteria.availEndDate}
                                    onChange={this.handleChangeAvailEndDate}
                                />
                        </span>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-md-end">
                    {/*<div className="col col-lg-1">*/}
                        {/*<Button outline color="secondary">clear</Button>*/}
                    {/*</div>*/}
                    <div className="col col-lg-2">
                        <Button outline color="secondary" onClick={this.handleClear}>clear</Button>
                        {' '}
                        <Button outline color="secondary">filter</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapState, mapActions)(AdvancedSearchPanel)