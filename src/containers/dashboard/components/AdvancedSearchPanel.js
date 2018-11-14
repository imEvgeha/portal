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
import {downloadFile} from '../../../util/Common';
import {exportService} from '../ExportService';

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        reportName: state.dashboard.reportName,
        searchCriteria: state.dashboard.advancedSearchCriteria,
        availsMapping: state.root.availsMapping,
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
        availsMapping: t.object,
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
            invalidForm: false
        };
        this.handleBulkExport = this.handleBulkExport.bind(this);
        this.bulkExport = this.bulkExport.bind(this);
        this.validateState = this.validateState.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateValidate = this.handleDateValidate.bind(this);

        this.availsMap=null;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [name]: value});
        this.setState({invalidForm: this.validateState(this.state.invalid)});
    }

    handleDateChange(name, value) {
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [name]: value});
    }

    handleDateValidate(name, value) {
        const state = {invalid: {...this.state.invalid, [name]: value}};
        state.invalidForm = !this.validateState(state.invalid);
        this.setState(state);
    }

    validateState(invalidState) {
        for (let key of Object.keys(invalidState)) {
            if (invalidState[key]) { return false; }
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
        exportService.bulkExportAvails(advancedSearchHelper.prepareAdvancedSearchCall(this.props.searchCriteria))
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
        const searchBy = ['title', 'studio', 'releaseYear', 'releaseType', 'licensor', 'territory', 'estStart', 'estEnd', 'vodStart', 'vodEnd'];
        if(this.availsMap===null && this.props.availsMapping!=null){
            this.availsMap={};
            this.props.availsMapping.mappings.map(column => this.availsMap[column.javaVariableName] = column);
        }

        const renderTextField = (name, displayName) => {
            return (<div key={name} style={{ maxWidth:'300px', minWidth:'300px', flex:'1 1 300px', margin:'0 10px'}}>
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
                key={name}
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

        let searchFields = [];
        if(this.availsMap != null) searchBy.map(key => {
            let schema = this.availsMap[key];
            if(schema.dataType=='date'){
                searchFields.push(renderRangeDatepicker(key, schema.displayName));
            }else{
                searchFields.push(renderTextField(key, schema.displayName));
            }
        });

        return (
            <div className={'nx-stylish container-fluid vu-advanced-search-panel ' + (this.props.hide ? 'hide' : '')}
                 style={{background: 'rgba(0,0,0,0.1)', padding: '1em'}}>
                <button type="button" className="close" aria-label="Close" onClick={this.props.onToggleAdvancedSearch}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start',  alignItems:'flex-start'}}>
                    {searchFields}
                    {renderRangeDatepicker('rowEdited', 'Row edited')}
                     <div style={{flex:'1 1 200px', marginTop: '30px', marginBottom: '0'}}>
                         <input style={{margin: '2px', marginRight: '6px', fontSize: 'medium'}}  name={'rowInvalid'} type={'checkbox'} checked={this.props.searchCriteria.rowInvalid} onChange={this.handleInputChange}/>
                         Show invalid avails
                     </div>
                </div>
                <div>
                     <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-end', alignItems:'flex-start', alignContent:'flex-end', margin: '8px 0px 0px'}}>
                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleBulkExport}
                                 disabled={this.state.invalidForm}
                                 style={{ margin: '4px 7px 0'}}>bulk export</Button>
                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleDelete}
                                 style={{width: '80px', margin: '4px 7px 0'}}>delete</Button>

                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-clear-btn'} onClick={this.handleClear}
                                 style={{width: '80px', margin: '4px 7px 0'}}>clear</Button>

                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleSave}
                                 disabled={this.state.invalidForm}
                                 style={{width: '80px', margin: '4px 7px 0'}}>save</Button>

                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-filter-btn'} onClick={this.handleSearch}
                                 disabled={this.state.invalidForm}
                                 style={{width: '80px', margin: '4px 7px 0'}}>filter</Button>
                     </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchPanel);