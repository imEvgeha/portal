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
import moment from 'moment';
import CloseableBtn from '../../../components/fields/CloseableBtn';
import Select from 'react-select';

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        reportName: state.dashboard.session.reportName,
        searchCriteria: state.dashboard.session.advancedSearchCriteria,
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
        if (e.key === 'Enter' && !this.state.invalidForm) {
            this.handleSearch();
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            reportName: '',
            invalidForm: false,
            selected: null,
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
        this.handleDateInvalid = this.handleDateInvalid.bind(this);
        this.saveSearchField = this.saveSearchField.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.availsMap=null;
        this.searchOptions=[];
    }

    handleSelect(option) {
        this.setState({selected: option, value: this.props.searchCriteria[option.value]});
    }

    selectField(name) {
        this.handleSelect(this.searchOptions.find( (option) => (name === option.value)));
    }

    removeField(name) {
        if (this.state.selected && this.state.selected.value === name) {
            this.setState({selected: null, value: null});
        }
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [name]: null});
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            value: {...this.state.value, value: value},
            invalidForm: !this.validateState(this.state.invalid)
        });
    }

    handleDateChange(name, value) {
        this.setState({value: {...this.state.value, [name]: value}});
    }

    handleDateInvalid(name, value) {
        // const state = {invalid: {...this.state.invalid, [name]: value}};
        // state.invalidForm = !this.validateState(state.invalid);
        console.log(`name: ${name}, value: ${value}`);
        this.setState({invalidForm: value});
    }

    saveSearchField() {
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [this.state.selected.value]: this.state.value});
        this.setState({selected: null, value: null});
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
    }

    handleSave() {
        saveReportModal.open((reportName) => {configurationService.saveReport(reportName);}, () => {}, {reportName: this.props.reportName});
    }

    handleSearch() {
        this.props.onSearch(this.props.searchCriteria);
    }
    render() {
        const searchBy = ['title', 'studio', 'releaseYear', 'releaseType', 'licensor', 'territory', 'estStart', 'estEnd', 'vodStart', 'vodEnd'];

        const showCriteriaSet = new Set();
        for (let key of Object.keys(this.props.searchCriteria) ) {
            const value = this.props.searchCriteria[key];
            if (value) {
                showCriteriaSet.add(key);
            }
        }

        if (this.props.availsMapping) {

            if(this.availsMap === null){
                this.availsMap = {};
                this.searchOptions = [];
                this.props.availsMapping.mappings.forEach( (mapping) => {
                    this.availsMap[mapping.javaVariableName] = mapping;
                    this.searchOptions.push({value: mapping.javaVariableName, label: mapping.displayName});
                });
            }
        }

        if(this.availsMap===null && this.props.availsMapping!=null){
            this.availsMap={};
            this.props.availsMapping.mappings.map(column => this.availsMap[column.javaVariableName] = column);
        }

        const renderTextField = (name, displayName) => {
            return (<div key={name} style={{ maxWidth:'300px', minWidth:'300px', flex:'1 1 300px', margin:'0 10px'}}>
                {/*<label htmlFor={'dashboard-avails-search-' + name + '-text'}>{displayName}</label>*/}
                <input type="text" className="form-control"
                       id={'dashboard-avails-search-' + name + '-text'}
                       placeholder={'Enter ' + displayName}
                       name={name}
                       disabled={this.props.searchCriteria.rowInvalid}
                       value={this.state.value && this.state.value.value}
                       onChange={this.handleInputChange}
                       onKeyPress={this._handleKeyPress}/>
            </div>);
        };

        const renderRangeDatepicker = (name, displayName) => {
            return (<RangeDatapicker
                key={name}
                hideLabel={true}
                displayName={displayName}
                value={this.state.value ? this.state.value : {from: null, to: null}}
                disabled={this.props.searchCriteria.rowInvalid}
                onFromDateChange={(value) => this.handleDateChange('from', value)}
                onToDateChange={(value) => this.handleDateChange('to', value)}
                onInvalid={(value) => this.handleDateInvalid(name, value)}
                handleKeyPress={this._handleKeyPress}
            />);
        };

        const renderCloseableInput = (name, displayName) => {
            return (<div key={name} style={{ maxWidth:'300px', minWidth:'300px', flex:'1 1 300px', margin:'5px 10px'}}>
                {/*<label htmlFor={'dashboard-avails-search-' + name + '-text'}>{displayName}</label>*/}
                <input type="text" className="form-control"
                       id={'dashboard-avails-search-' + name + '-text'}
                       name={name}
                       disabled={true}
                       value={displayName + ' = ' + this.props.searchCriteria[name]}
                       onKeyPress={this._handleKeyPress}/>
            </div>);
        };


        const renderCloseableBtn = (name, displayName) => {
            return (<div key={name} style={{ maxWidth:'300px', margin:'5px 5px'}}>
                <CloseableBtn
                    title={displayName}
                    value={ ' = ' + this.props.searchCriteria[name].value }
                    onClick={() => this.selectField(name)}
                    onClose={() => this.removeField(name)}
                    id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                />
            </div>);
        };


        const renderCloseableDateBtn = (name, displayName) => {
            function prepareDate(prefix, date) {
                return date ? prefix + ' ' + moment(date).format('L') : '';
            }
            return (<div key={name} style={{maxWidth:'330px', margin:'5px 5px'}}>
                <CloseableBtn
                    title={displayName}
                    onClick={() => this.selectField(name)}
                    onClose={() => this.removeField(name)}
                    value={prepareDate(' from', this.props.searchCriteria[name].from) + ' ' + prepareDate('to', this.props.searchCriteria[name].to)}
                    id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                />
            </div>);
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

        const renderCloseable = () => {
            if (this.availsMap != null) {
                return Array.from(showCriteriaSet).map((key) => {
                    const schema = this.availsMap[key];
                    if (schema) {
                        if (schema.dataType === 'date') {
                            return renderCloseableDateBtn(key, schema.displayName);
                        } else {
                            return renderCloseableBtn(key, schema.displayName);
                        }
                    } else {
                        console.warn('Cannot determine schema for field: ' + key);
                    }
                });
            }
            return null;
        };

        const options = this.searchOptions.filter((option) => (!showCriteriaSet.has(option.value)));

        const renderSelect = () => {
            return (
                <Select
                    onChange={(option) => {this.handleSelect(option)}}
                    value={this.state.selected}
                    placeholder={'Select field to search'}
                    options={options}
                > </Select>
            );
        };

        const renderSelectedInput = () => {
            const selected = this.state.selected;
            if (!selected) return '';

            let schema = this.availsMap[selected.value];
            if(schema.dataType=='date'){
               return renderRangeDatepicker(selected, schema.displayName);
            }else{
                return renderTextField(selected, schema.displayName);
            }
        };

        return (
            <div className={'nx-stylish container-fluid vu-advanced-search-panel ' + (this.props.hide ? 'hide' : '')}
                 style={{background: 'rgba(0,0,0,0.1)', padding: '1em', overflow: this.props.hide ? 'hidden' : 'visible' }}>
                <button type="button" className="close" aria-label="Close" onClick={this.props.onToggleAdvancedSearch}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start',  alignItems:'flex-start'}}>
                    <div style={{width: '250px', margin:'16px 0'}}>
                        {renderSelect()}
                    </div>
                    <div style={{margin:'16px 2px'}}>
                        {renderSelectedInput()}
                    </div>
                    <div style={{margin:'16px 0'}}>
                        { this.state.selected &&
                            <Button outline color="secondary" id={'dashboard-avails-advanced-search-add-btn'} onClick={this.saveSearchField}
                                disabled={this.state.invalidForm}
                                style={{width: '80px'}}>add</Button>
                        }
                    </div>
                </div>
                <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start',  alignItems:'flex-start'}}>
                    {renderCloseable()}
                </div>
                <div className="d-flex flex-row justify-content-between mt-2">
                    <div style={{margin:'0 5px', alignSelf: 'center'}}>
                        <input style={{margin: '2px', marginRight: '6px', fontSize: 'medium'}}  name={'rowInvalid'} type={'checkbox'} checked={this.props.searchCriteria.rowInvalid} onChange={this.handleInputChange}/>
                        Show invalid avails
                    </div>
                     <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-end', alignItems:'flex-start', alignContent:'flex-end', margin: '0px 0px 2px'}}>
                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleBulkExport}
                                 disabled={this.state.invalidForm}
                                 style={{ margin: '4px 7px 0'}}>bulk export</Button>
                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleDelete}
                                 disabled={!this.props.reportName}
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