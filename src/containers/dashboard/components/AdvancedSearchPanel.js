import React from 'react';
import {Button} from 'reactstrap';
import {
    searchFormUpdateAdvancedSearchCriteria
} from '../../../actions/dashboard';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import {saveReportModal} from './SaveReportModal';
import {advancedSearchHelper} from '../AdvancedSearchHelper';
import RangeDatapicker from '../../../components/fields/RangeDatapicker';

const mapStateToProps = state => {
    return {
        reportName: state.session.reportName,
        searchCriteria: state.dashboard.advancedSearchCriteria,
    };
};

const mapDispatchToProps = {
    searchFormUpdateAdvancedSearchCriteria,
};

class AdvancedSearchPanel extends React.Component {
    static propTypes = {
        searchCriteria: t.object,
        onSearch: t.func,
        searchFormUpdateAdvancedSearchCriteria: t.func,
        onToggleAdvancedSearch: t.func,
        hide: t.bool,
        reportName: t.string,
    };

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    };
    clearHandlers = {};

    constructor(props) {
        super(props);
        this.state = {
            invalidStartDate: '',
            invalidEndDate: '',
            invalid: {},
            reportName: '',
            showInvalid: false
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateValidate = this.handleDateValidate.bind(this);
        this.toggleShowInvalid = this.toggleShowInvalid.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [name]: value});
    }

    handleDateChange(name, value) {
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [name]: value});
    }

    handleDateValidate(name, value) {
        this.setState({invalid: {...this.state.invalid, [name]: value}});
    }

    handleDelete() {
    }

    handleClear() {
        advancedSearchHelper.clearAdvancedSearchForm();
        this.setState({
            invalidStartDate: '',
            invalidEndDate: '',
        });
        for (let key in this.clearHandlers) {
            if (this.clearHandlers.hasOwnProperty(key)){
                this.clearHandlers[key]();
            }
        }
    }

    handleSave() {
        saveReportModal.open(() => {}, () => {}, {reportName: this.props.reportName});
    }

    handleSearch() {
        this.props.onSearch(this.props.searchCriteria);
    }

    toggleShowInvalid() {
        this.setState({showInvalid: !this.state.showInvalid});
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
                                   disabled={this.state.showInvalid}
                                   value={this.props.searchCriteria.title}
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
                                   disabled={this.state.showInvalid}
                                   value={this.props.searchCriteria.studio}
                                   onChange={this.handleInputChange}
                                   onKeyPress={this._handleKeyPress}/>
                        </div>
                    </div>
                    <div className="col">
                        <RangeDatapicker
                            displayName={'VOD Start'}
                            fromDate={this.props.searchCriteria.vodStartFrom}
                            toDate={this.props.searchCriteria.vodStartTo}
                            disabled={this.state.showInvalid}
                            onFromDateChange={(value) => this.handleDateChange('vodStartFrom', value)}
                            onToDateChange={(value) => this.handleDateChange('vodStartTo', value)}
                            onValidate={(value) => this.handleDateValidate('vodStart', value)}
                            setClearHandler={ handler => this.clearHandlers.vodStart = handler}
                        />
                    </div>
                    <div className="col">
                        <RangeDatapicker
                            displayName={'VOD End'}
                            fromDate={this.props.searchCriteria.vodEndFrom}
                            toDate={this.props.searchCriteria.vodEndTo}
                            disabled={this.state.showInvalid}
                            onFromDateChange={(value) => this.handleDateChange('vodEndFrom', value)}
                            onToDateChange={(value) => this.handleDateChange('vodEndTo', value)}
                            onValidate={(value) => this.handleDateValidate('vodEnd', value)}
                            setClearHandler={ handler => this.clearHandlers.vodEnd = handler}
                        />
                    </div>
                    {/*<div className="col">*/}
                        {/*<div className="form-group">*/}
                            {/*<label htmlFor="dashboard-avails-search-end-date-text">VOD End</label>*/}
                            {/*<span onClick={this.setupVodEndDate}>*/}
                                {/*<DatePicker*/}
                                    {/*ref={this.refDatePickerEnd}*/}
                                    {/*className={this.state.invalidEndDate ? 'text-danger' : ''}*/}
                                    {/*id="dashboard-avails-search-end-date-text"*/}
                                    {/*selected={this.props.searchCriteria.vodEnd}*/}
                                    {/*onChange={this.handleChangeVodEndDate}*/}
                                    {/*onChangeRaw={(event) => this.handleChangeRawVodEndDate(event.target.value)}*/}
                                    {/*todayButton={'Today'}*/}
                                {/*/>*/}
                                {/*{this.state.invalidEndDate && <small className="text-danger m-2"*/}
                                                                     {/*style={{position: 'absolute', bottom: '-9px'}}>{this.state.invalidEndDate}</small>}*/}
                            {/*</span>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                </div>

                <div className="row justify-content-between">
                    <div>
                        { !this.state.showInvalid && <Button outline color="secondary" id={'dashboard-avails-advanced-search-show-invalid-btn'} onClick={this.toggleShowInvalid}
                                style={{marginLeft: '15px'}}><i className="far fa-circle"></i> Show invalid</Button>}
                        { this.state.showInvalid && <Button color="primary" id={'dashboard-avails-advanced-search-show-invalid-btn'} onClick={this.toggleShowInvalid}
                                                             style={{marginLeft: '15px'}}><i className="far fa-check-circle"></i> Show invalid</Button>}
                    </div>

                    <div>
                        <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleDelete}
                                style={{width: '80px', marginRight: '15px'}}>delete</Button>

                        <Button outline color="secondary" id={'dashboard-avails-advanced-search-clear-btn'} onClick={this.handleClear}
                                style={{width: '80px', marginRight: '15px'}}>clear</Button>

                        <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleSave}
                                style={{width: '80px', marginRight: '15px'}}>save</Button>

                        <Button outline color="secondary" id={'dashboard-avails-advanced-search-filter-btn'} onClick={this.handleSearch}
                                style={{width: '80px', marginRight: '60px'}}>filter</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchPanel);