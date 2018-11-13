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
import {configurationService} from '../ConfigurationService';
import {alertModal} from '../../../components/share/AlertModal';
import {confirmModal} from '../../../components/share/ConfirmModal';
import {dashboardService} from '../DashboardService';
import {downloadFile} from '../../../util/Common';

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        reportName: state.dashboard.reportName,
        searchCriteria: state.dashboard.advancedSearchCriteria,
    };
};

const mapDispatchToProps = {
    searchFormUpdateAdvancedSearchCriteria,
};

class AdvancedSearchPanel extends React.Component {
    static propTypes = {
        searchCriteria: t.object,
        availTabPage: t.object,
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
        };
        this.handleBulkExport = this.handleBulkExport.bind(this);
        this.bulkExport = this.bulkExport.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateValidate = this.handleDateValidate.bind(this);
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

    validateForm() {
        for (let key of Object.keys(this.state.invalid)) {
            if (this.state.invalid[key]) { return false; }
        }
        return true;
    }

    handleBulkExport() {
        if (!this.props.availTabPage.total) {
            alertModal.open('Action required', () => {
            }, {description: 'There is no result of search, please change filters.'});
        } else if (this.props.availTabPage.total > 50000) {
            alertModal.open('Action required', () => {
            }, {description: 'You have more that 50000 avails, please change filters'});
        } else {
            confirmModal.open('Confirm download',
                this.bulkExport,
                () => {
                },
                {description: `You have ${this.props.availTabPage.total} avails for download.`});
        }
    }

    bulkExport() {
        dashboardService.bulkExportAvails(this.props.searchCriteria)
        .then(function (response) {
            downloadFile(response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
    }

    handleDelete() {
        confirmModal.open('Confirm delete',
            () => {
                configurationService.deleteReport(this.props.reportName);
            },
            () => {
            },
            {description: `Do you want to delete ${this.props.reportName} report.`});
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
        saveReportModal.open((reportName) => {configurationService.saveReport(reportName);}, () => {}, {reportName: this.props.reportName});
    }

    handleSearch() {
        this.props.onSearch(this.props.searchCriteria);
    }

    render() {

        const renderTextField = (name, displayName) => {
            return (<div className="form-group">
                <label htmlFor={'dashboard-avails-search-' + name + '-text'}>{displayName}</label>
                <input type="text" className="form-control"
                       id={'dashboard-avails-search-' + name + '-text'}
                       placeholder={'Enter ' + displayName}
                       name={name}
                       disabled={this.props.searchCriteria.rowInvalid}
                       value={this.props.searchCriteria[name]}
                       onChange={this.handleInputChange}
                       onKeyPress={this._handleKeyPress}/>
            </div>);
        };

        const renderRangeDatepicker = (name, displayName) => {
            return (<RangeDatapicker
                displayName={displayName}
                fromDate={this.props.searchCriteria[name + 'From']}
                toDate={this.props.searchCriteria[name + 'To']}
                disabled={this.props.searchCriteria.rowInvalid}
                onFromDateChange={(value) => this.handleDateChange(name +'From', value)}
                onToDateChange={(value) => this.handleDateChange(name + 'To', value)}
                onValidate={(value) => this.handleDateValidate(name, value)}
                setClearHandler={ handler => this.clearHandlers[name] = handler}
            />);
        };

        return (
            <div className={'nx-stylish container-fluid vu-advanced-search-panel ' + (this.props.hide ? 'hide' : '')}
                 style={{background: 'rgba(0,0,0,0.1)', padding: '1em'}}>
                <button type="button" className="close" aria-label="Close" onClick={this.props.onToggleAdvancedSearch}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <div className="row">
                    <div className="col">
                        {renderTextField('title', 'Title')}
                    </div>
                    <div className="col">
                        {renderTextField('studio', 'Studio')}
                    </div>
                    <div className="col">
                        {renderTextField('releaseYear', 'Release Year')}
                    </div>
                    <div className="col">
                        {renderTextField('releaseType', 'Release Type')}
                    </div>
                    <div className="col">
                        {renderTextField('licensor', 'Licensor')}
                    </div>
                </div>
                <div className="row" style={{marginRight: '30px'}}>
                    <div className="col">
                        {renderTextField('territory', 'Territory')}
                    </div>
                    <div className="col">
                        {renderRangeDatepicker('estStart', 'EST Start')}
                    </div>
                    <div className="col">
                        {renderRangeDatepicker('estEnd', 'EST End')}
                    </div>
                    <div className="col">
                        {renderRangeDatepicker('vodStart', 'VOD Start')}
                    </div>
                    <div className="col">
                        {renderRangeDatepicker('vodEnd', 'VOD End')}
                    </div>
                </div>

                <div className="row align-items-center" style={{marginRight: '30px'}}>
                    <div className="col">
                            {renderRangeDatepicker('rowEdited', 'Row edited')}
                            </div>
                    <div className="col" style={{paddingTop: '8px'}}>
                        <input style={{margin: '2px', marginRight: '6px', fontSize: 'medium'}}  name={'rowInvalid'} type={'checkbox'} checked={this.props.searchCriteria.rowInvalid} onChange={this.handleInputChange}/>
                        Show invalid avails
                    </div>
                    <div className="col">
                    </div>
                    <div className="col">
                    </div>

                    <div className="col">
                        {this.validateForm() ? 'ok' : 'none'}
                        <div style={{position: 'absolute', right: '-66px', bottom: '-17px', width: '569px'}}>
                            <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleBulkExport}
                                    style={{ marginRight: '15px'}}>bulk export</Button>
                            <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleDelete}
                                    style={{width: '80px', marginRight: '15px'}}>delete</Button>

                            <Button outline color="secondary" id={'dashboard-avails-advanced-search-clear-btn'} onClick={this.handleClear}
                                    style={{width: '80px', marginRight: '15px'}}>clear</Button>

                            <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleSave}
                                    style={{width: '80px', marginRight: '15px'}}>save</Button>

                            <Button outline color="secondary" id={'dashboard-avails-advanced-search-filter-btn'} onClick={this.handleSearch}
                                    disabled={!this.validateForm()}
                                    style={{width: '80px', marginRight: '60px'}}>filter</Button>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchPanel);