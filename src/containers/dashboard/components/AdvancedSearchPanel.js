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
        this.searchOptions=null;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [name]: value});
        this.setState({invalidForm: !this.validateState(this.state.invalid)});
    }

    handleDateChange(name, value) {
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [name]: value, [name + 'ADV']: {value: value}});
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
                if (key.endsWith('From')) {
                    showCriteriaSet.add(key.slice(0, -4));
                } else if (key.endsWith('To')) {
                    showCriteriaSet.add(key.slice(0, -2));
                } else {
                    showCriteriaSet.add(key);
                }
            }
        }

        if (this.props.availsMapping) {

            if(this.availsMap === null || this.searchOptions === null){
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
                    value={ ' = ' + this.props.searchCriteria[name] }
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
                    value={prepareDate(' from', this.props.searchCriteria[name + 'From']) + ' ' + prepareDate('to', this.props.searchCriteria[name + 'To'])}
                    id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                />
            </div>);
        };


        let searchFields = [];
        if(this.availsMap != null) searchBy.map(key => {
            let schema = this.availsMap[key];
            if(schema.dataType=='date'){
                searchFields.push(renderRangeDatepicker(key, schema.displayName));
                // btns.push(renderCloseableDateBtn(key, schema.displayName));

            }else{
                searchFields.push(renderTextField(key, schema.displayName));
                // btns.push(renderCloseableBtn(key, schema.displayName));
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


        return (
            <div className={'nx-stylish container-fluid vu-advanced-search-panel ' + (this.props.hide ? 'hide' : '')}
                 style={{background: 'rgba(0,0,0,0.1)', padding: '1em'}}>
                <button type="button" className="close" aria-label="Close" onClick={this.props.onToggleAdvancedSearch}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <div>
                    <div style={{width: '250px'}}>
                        <Select options={this.searchOptions ? this.searchOptions : []}> </Select>
                    </div>
                </div>
                <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start',  alignItems:'flex-start'}}>
                    {searchFields}
                    {renderRangeDatepicker('rowEdited', 'Row edited')}
                     <div style={{flex:'1 1 200px', margin:'30px 10px 0', marginBottom: '0'}}>
                         <input style={{margin: '2px', marginRight: '6px', fontSize: 'medium'}}  name={'rowInvalid'} type={'checkbox'} checked={this.props.searchCriteria.rowInvalid} onChange={this.handleInputChange}/>
                         Show invalid avails
                     </div>
                    {renderCloseable()}
                </div>
                <div>
                     <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-end', alignItems:'flex-start', alignContent:'flex-end', margin: '8px 0px 0px'}}>
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