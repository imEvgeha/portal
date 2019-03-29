import React from 'react';
import {Button} from 'reactstrap';
import {
    searchFormUpdateAdvancedSearchCriteria
} from '../../../../stores/actions/avail/dashboard';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import {saveReportModal} from './SaveReportModal';
import {rightSearchHelper} from '../RightSearchHelper';
import {configurationService} from '../../service/ConfigurationService';
import {alertModal} from '../../../../components/modal/AlertModal';
import {confirmModal} from '../../../../components/modal/ConfirmModal';
import {downloadFile} from '../../../../util/Common';
import {exportService} from '../../service/ExportService';
import moment from 'moment';
import CloseableBtn from '../../../../components/form/CloseableBtn';
import SelectableInput from '../../../../components/form/SelectableInput';

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        reportName: state.dashboard.session.reportName,
        searchCriteria: state.dashboard.session.advancedSearchCriteria,
        availsMapping: state.root.availsMapping,
    };
};

const mapDispatchToProps = {
    searchFormUpdateAdvancedSearchCriteria
};

const ignoreForCloseable = ['rowInvalid'];

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

    constructor(props) {
        super(props);
        this.state = {
            reportName: '',
            selected: null,
            value: null,
            blink: null,
        };
        this.handleBulkExport = this.handleBulkExport.bind(this);
        this.bulkExport = this.bulkExport.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleInvalidChange = this.handleInvalidChange.bind(this);
        this.addSearchField = this.addSearchField.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.blink = this.blink.bind(this);
        this.refSearchBtn = React.createRef();


        this.availsMap=null;
        this.searchOptions=[];
    }

    handleSelect(option) {
        if (!option) {
            this.setState({selected: null, value: {}});
        } else {
            const value = this.props.searchCriteria[option.value];
            this.setState({selected: option, value: value ? value : {}});
        }
    }

    blink(name) {
        this.setState({blink: name});
    }

    handleValueChange(value) {
        this.setState({value: value});
    }

    selectField(name) {
        this.handleSelect(this.searchOptions.find( (option) => (name === option.value)));
    }

    removeField(name) {
        if (this.state.selected && this.state.selected.value === name) {
            this.setState({selected: null, value: null});
        }
        const searchCriteria = {};

        let sortedFields = this.getSortedFieldsToShow();
        let position = 0;
        sortedFields.forEach((field) => {
            if (field.name !== name) {
                searchCriteria[field.name] = {...this.props.searchCriteria[field.name], order: position++};
            } else {
                searchCriteria[field.name] = null;
            }

        });
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, ...searchCriteria});
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [name]: {value: value}});
    }

    handleInvalidChange(event) {
        const value = event.target.value;
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, rowInvalid: {value: value}});
    }

    addSearchField() {
        const value = this.state.value;
        if ( this.isAnyValueSpecified() ) {
            if (!value.order && value.order !== 0) {
                value.order = this.getFieldsToShow().length;
            }
            this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [this.state.selected.value]: value});
            this.blink(this.state.selected.value);
        } else {
            this.removeField(this.state.selected.value);
        }
        this.setState({selected: null, value: null});
        this.refSearchBtn.current.focus();
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
        exportService.bulkExportAvails(rightSearchHelper.prepareAdvancedSearchCall(this.props.searchCriteria))
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
        this.handleSelect(null);
        rightSearchHelper.clearAdvancedSearchForm();
    }

    handleSave() {
        saveReportModal.open((reportName) => {
            if (this.props.reportName !== reportName && configurationService.getReportsNames().indexOf(reportName) > -1) {
                confirmModal.open('Report "' + reportName + '" already exists, do you wanna to overwrite?', () => {
                    configurationService.saveReport(reportName);
                });
            } else {
                configurationService.saveReport(reportName);
            }
        }, () => {
        }, {reportName: this.props.reportName});
    }

    handleSearch() {
        if ( !this.isAnyValueSpecified() ) {
            this.setState({selected: null, value: null});
        }
        this.setState({blink: null});
        this.props.onSearch(this.props.searchCriteria);
    }

    isAnyValueSpecified = () => {
        const value = this.state.value;
        return value && (value.from || value.to || (value.value  && value.value.trim()) || (value.options && value.options.length > 0));
    };

    getFieldsToShow() {
        const nonEmptyFields = [];
        for (let key of Object.keys(this.props.searchCriteria) ) {
            const field = this.props.searchCriteria[key];
            if (field) {
                field.name = key;
                nonEmptyFields.push(field);
            }
        }
        return nonEmptyFields;
    }

    getSortedFieldsToShow() {
        return this.getFieldsToShow().sort( (a, b) => (a.order ? a.order : -1)  - (b.order ? b.order : -1) );
    }

    render() {
        if (this.props.availsMapping && this.availsMap === null) {
            this.availsMap = {};
            this.searchOptions = [];
            this.props.availsMapping.mappings.forEach( (mapping) => {
                this.availsMap[mapping.queryParamName] = mapping;
                if (mapping.enableSearch) {
                    this.searchOptions.push({value: mapping.queryParamName, label: mapping.displayName});
                }
            });
        }

        const fieldsToShow = this.getSortedFieldsToShow().map((field) => (field.name));
        const options = this.searchOptions.filter((option) => (!(fieldsToShow.indexOf(option.value) > -1)));
        options.sort((a,b) => a.label.toUpperCase() < b.label.toUpperCase() ? -1 : 1);

        const renderCloseableBtn = (name, displayName) => {
            return (
                <div key={name} style={{ maxWidth:'300px', margin:'5px 5px'}}>
                    <CloseableBtn
                        title={displayName}
                        value={ ' = ' + this.props.searchCriteria[name].value }
                        onClick={() => this.selectField(name)}
                        onClose={() => this.removeField(name)}
                        highlighted={this.state.blink === name}
                        id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                    />
                </div>
            );
        };

        const renderCloseableSelectBtn = (name, displayName) => {
            return (
                <div key={name} style={{ maxWidth:'300px', margin:'5px 5px'}}>
                    <CloseableBtn
                        title={displayName}
                        value={ ' = ' + (this.props.searchCriteria[name].options ? this.props.searchCriteria[name].options.map(({label}) => label).join(', ') : '')}
                        onClick={() => this.selectField(name)}
                        onClose={() => this.removeField(name)}
                        highlighted={this.state.blink === name}
                        id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                    />
                </div>
            );
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
                    highlighted={this.state.blink === name}
                    value={prepareDate(' from', this.props.searchCriteria[name].from) + ' ' + prepareDate('to', this.props.searchCriteria[name].to)}
                    id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                />
            </div>);
        };

        const renderCloseableDurationBtn = (name, displayName) => {
            function prepareDuration(prefix, value) {
                return value ? prefix + ' ' + value : '';
            }
            return (<div key={name} style={{maxWidth:'330px', margin:'5px 5px'}}>
                <CloseableBtn
                    title={displayName}
                    onClick={() => this.selectField(name)}
                    onClose={() => this.removeField(name)}
                    highlighted={this.state.blink === name}
                    value={prepareDuration(' from', this.props.searchCriteria[name].from) + ' ' + prepareDuration('to', this.props.searchCriteria[name].to)}
                    id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                />
            </div>);
        };

        const renderCloseable = () => {
            if (this.availsMap != null) {
                return Array.from(fieldsToShow).map((key) => {
                    const schema = this.availsMap[key];
                    if (ignoreForCloseable.indexOf(key) === -1) {
                        if (schema) {
                            switch (schema.searchDataType) {
                                case 'string' : return renderCloseableBtn(key, schema.displayName);
                                case 'integer' : return renderCloseableBtn(key, schema.displayName);
                                case 'double' : return renderCloseableBtn(key, schema.displayName);
                                case 'multiselect' : return renderCloseableSelectBtn(key, schema.displayName);
                                case 'multilanguage' : return renderCloseableSelectBtn(key, schema.displayName);
                                case 'duration' : return renderCloseableDurationBtn(key, schema.displayName);
                                case 'time' : return renderCloseableBtn(key, schema.displayName);
                                case 'date' : return renderCloseableDateBtn(key, schema.displayName);
                                case 'boolean' : return renderCloseableBtn(key, schema.displayName);
                                default:
                                    console.warn('Unsupported DataType: ' + schema.searchDataType + ' for field name: ' + schema.displayName);
                            }
                        } else {
                            console.warn('Cannot determine schema for field: ' + key);
                        }
                    }
                });
            }
            return null;
        };

        const renderSpecialCloseable = () => {
            return (
                this.props.searchCriteria.availHistoryIds &&
                <div key={name} style={{maxWidth: '400px', margin: '5px 5px'}}>
                    <CloseableBtn
                        title={'Avail History'}
                        value={' = ' + this.props.searchCriteria.availHistoryIds.subTitle}
                        onClose={() => {
                            this.props.searchFormUpdateAdvancedSearchCriteria({availHistoryIds: null});
                        }}
                        id={'dashboard-avails-advanced-search-' + 'AvailId' + '-criteria'}
                    />
                </div>
            );
        };
        return (
            <div className={'nx-stylish container-fluid vu-advanced-search-panel ' + (this.props.hide ? 'hide' : '')}
                 style={{background: 'rgba(0,0,0,0.1)', padding: '1em', overflow: this.props.hide ? 'hidden' : 'visible' }}>
                <button type="button" className="close" aria-label="Close" onClick={this.props.onToggleAdvancedSearch}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <SelectableInput
                    options={options}
                    currentCriteria={this.props.searchCriteria}
                    selected={this.state.selected}
                    value={this.state.value}
                    dataType={this.state.selected ? this.availsMap[this.state.selected.value].searchDataType : null}
                    displayName={this.state.selected ? this.availsMap[this.state.selected.value].displayName : null}
                    id={'dashboard-avails-advanced-search-selectable'}

                    onChange={this.handleValueChange}
                    onSelect={this.handleSelect}
                    onSave={this.addSearchField}
                />
                <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start',  alignItems:'flex-start'}}>
                    {renderSpecialCloseable()}
                    {renderCloseable()}
                </div>
                <div className="d-flex flex-row justify-content-between mt-2">
                    <div style={{margin:'0 5px', alignSelf: 'center'}}>
                        Show:
                        <select className="form-control border-1 d-inline"
                                id={'dashboard-avails-report-select'}
                                onChange={this.handleInvalidChange}
                                value={this.props.searchCriteria.rowInvalid ? this.props.searchCriteria.rowInvalid.value : ''}
                                style={{width: '100px', background: 'initial', margin: '0 5px'}}
                        >
                            <option value="">All</option>
                            <option value="false">Valid</option>
                            <option value="true">Invalid</option>
                        </select>
                    </div>
                     <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-end', alignItems:'flex-start', alignContent:'flex-end', margin: '0px 0px 2px'}}>
                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleBulkExport}
                                 style={{ margin: '4px 7px 0'}}>bulk export</Button>
                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleDelete}
                                 disabled={!this.props.reportName}
                                 style={{width: '80px', margin: '4px 7px 0'}}>delete</Button>
                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-clear-btn'} onClick={this.handleClear}
                                 style={{width: '80px', margin: '4px 7px 0'}}>clear</Button>
                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-save-btn'} onClick={this.handleSave}
                                 style={{width: '80px', margin: '4px 7px 0'}}>save</Button>
                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-filter-btn'} onClick={this.handleSearch}
                                 innerRef={this.refSearchBtn}
                                 style={{width: '80px', margin: '4px 7px 0'}}>filter</Button>
                     </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchPanel);