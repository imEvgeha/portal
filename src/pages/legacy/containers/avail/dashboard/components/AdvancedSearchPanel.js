import React from 'react';
import {Button} from 'reactstrap';
import {
    searchFormUpdateAdvancedSearchCriteria,
    setHistoryCache,
    resultPageSetBulkExport,
} from '../../../../stores/actions/avail/dashboard';
import {connect} from 'react-redux';

import PropTypes from 'prop-types';
import {saveReportModal} from './SaveReportModal';
import {rightSearchHelper} from '../RightSearchHelper';
import {configurationService} from '../../service/ConfigurationService';
import {historyService} from '../../service/HistoryService';
import {alertModal} from '../../../../components/modal/AlertModal';
import {confirmModal} from '../../../../components/modal/ConfirmModal';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import {exportService} from '../../service/ExportService';
import moment from 'moment';
import CloseableBtn from '../../../../components/form/CloseableBtn';
import SelectableInput from '../../../../components/form/SelectableInput';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        availTabPageSort: state.dashboard.session.availTabPageSort,
        reportName: state.dashboard.session.reportName,
        searchCriteria: state.dashboard.session.advancedSearchCriteria,
        availsMapping: state.root.availsMapping,
        columns: state.dashboard.session.columns,
        historyCache: state.dashboard.session.historyCache,
        bulkExportAvailable: state.dashboard.bulkExportAvailable,
    };
};

const mapDispatchToProps = {
    searchFormUpdateAdvancedSearchCriteria,
    setHistoryCache,
    resultPageSetBulkExport,
};

const ignoreForCloseable = ['invalid'];

class AdvancedSearchPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            value: null,
            blink: null,
            exportAll: false,
        };
        this.loadingHistoryData = {};

        this.handleBulkExport = this.handleBulkExport.bind(this);
        this.bulkExport = this.bulkExport.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.addSearchField = this.addSearchField.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.blink = this.blink.bind(this);
        this.refSearchBtn = React.createRef();

        this.availsMap = null;
        this.searchOptions = [];
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
        this.handleSelect(this.searchOptions.find(option => name === option.value));
    }

    removeField(name) {
        if (this.state.selected && this.state.selected.value === name) {
            this.setState({selected: null, value: null});
        }
        const searchCriteria = {};

        const sortedFields = this.getSortedFieldsToShow();
        let position = 0;
        sortedFields.forEach(field => {
            if (field.name !== name) {
                searchCriteria[field.name] = {...this.props.searchCriteria[field.name], order: position++};
            } else {
                searchCriteria[field.name] = null;
            }
        });
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, ...searchCriteria});
        this.props.resultPageSetBulkExport(false);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.props.searchFormUpdateAdvancedSearchCriteria({...this.props.searchCriteria, [name]: {value: value}});
    }

    addSearchField() {
        const value = this.state.value;
        if (this.isAnyValueSpecified()) {
            if (!value.order && value.order !== 0) {
                value.order = this.getFieldsToShow().length;
            }
            this.props.searchFormUpdateAdvancedSearchCriteria({
                ...this.props.searchCriteria,
                [this.state.selected.value]: value,
            });
            this.blink(this.state.selected.value);
        } else {
            this.removeField(this.state.selected.value);
        }
        this.setState({selected: null, value: null});
        this.props.resultPageSetBulkExport(false);
        this.refSearchBtn.current.focus();
    }

    handleBulkExport() {
        if (!this.props.bulkExportAvailable) {
            alertModal.open('Action required', () => {}, {
                description: 'Search results are not aligned with the filtering, please apply filter before exporting',
            });
        } else if (!this.props.availTabPage.total) {
            alertModal.open('Action required', () => {}, {
                description: 'There is no result of search, please change filters.',
            });
        } else if (this.props.availTabPage.total > 50000) {
            alertModal.open('Action required', () => {}, {
                description: 'You have more that 50000 avails, please change filters',
            });
        } else {
            const onChange = () => {
                this.setState({exportAll: !this.state.exportAll});
            };
            const option = (
                <div key="exportAll">
                    <br />{' '}
                    <input type="checkbox" name="buck_export_all" style={{marginRight: '8px'}} onChange={onChange} />
                    Export all Fields
                </div>
            );
            const options = [`You have ${this.props.availTabPage.total} avails for download.`, option];
            confirmModal.open(
                'Confirm download',
                () => {
                    this.bulkExport(this.state.exportAll);
                    this.setState({exportAll: false});
                },
                () => {
                    this.setState({exportAll: false});
                },
                {description: options}
            );
        }
    }

    bulkExport(exportAll) {
        let exportColumns = this.props.columns.slice(0);
        if (exportAll) {
            exportColumns = exportColumns.concat(
                this.props.availsMapping.mappings
                    .filter(({dataType}) => dataType)
                    .map(({javaVariableName}) => javaVariableName)
                    .filter(javaVariableName => !exportColumns.includes(javaVariableName))
            );
        }
        exportService
            .bulkExportAvails(
                rightSearchHelper.prepareAdvancedSearchCall(this.props.searchCriteria),
                exportColumns,
                this.props.availTabPageSort
            )
            .then(function (response) {
                downloadFile(response);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    handleDelete() {
        confirmModal.open(
            'Confirm delete',
            () => {
                configurationService.deleteReport(this.props.reportName);
            },
            () => {},
            {description: `Do you want to delete ${this.props.reportName} report.`}
        );
    }

    handleClear() {
        this.handleSelect(null);
        rightSearchHelper.clearAdvancedSearchForm();
        this.handleSearch(null, {});
    }

    handleSave() {
        saveReportModal.open(
            reportName => {
                if (
                    this.props.reportName !== reportName &&
                    configurationService.getReportsNames().indexOf(reportName) > -1
                ) {
                    confirmModal.open('Report "' + reportName + '" already exists, do you wanna to overwrite?', () => {
                        configurationService.saveReport(reportName);
                    });
                } else {
                    configurationService.saveReport(reportName);
                }
            },
            () => {},
            {reportName: this.props.reportName}
        );
    }

    handleSearch(e, criteria = null) {
        criteria = criteria || this.props.searchCriteria;
        if (!this.isAnyValueSpecified()) {
            this.setState({selected: null, value: null});
        }
        this.setState({blink: null});
        this.props.onSearch(criteria);
    }

    isAnyValueSpecified = () => {
        const value = this.state.value;
        return (
            value &&
            (value.from ||
                value.to ||
                (value.value && value.value.trim()) ||
                (value.options && value.options.length > 0))
        );
    };

    getFieldsToShow() {
        const nonEmptyFields = [];
        for (const key of Object.keys(this.props.searchCriteria)) {
            const field = this.props.searchCriteria[key];
            if (field) {
                field.name = key;
                nonEmptyFields.push(field);
            }
        }
        return nonEmptyFields;
    }

    getSortedFieldsToShow() {
        return this.getFieldsToShow().sort((a, b) => (a.order ? a.order : -1) - (b.order ? b.order : -1));
    }

    getHistoryData(availHistoryId) {
        historyService
            .getHistory(availHistoryId)
            .then(res => {
                if (res && this.loadingHistoryData[availHistoryId]) {
                    delete this.loadingHistoryData[availHistoryId];
                    this.props.setHistoryCache({[availHistoryId]: res});
                }
            })
            .catch(() => {});
    }

    componentWillUnmount() {
        this.loadingHistoryData = {};
    }

    componentDidMount() {
        if (this.props.location && this.props.location.state) {
            this.props.setHistoryCache({[this.props.location.state.id]: this.props.location.state});
        }
    }

    render() {
        if (this.props.availsMapping && this.availsMap === null) {
            this.availsMap = {};
            this.searchOptions = [];
            this.props.availsMapping.mappings.forEach(mapping => {
                this.availsMap[mapping.queryParamName] = mapping;
                if (mapping.enableSearch) {
                    this.searchOptions.push({
                        value: mapping.queryParamName,
                        label: mapping.displayName,
                        field: mapping.javaVariableName,
                    });
                }
            });
        }

        const fieldsToShow = this.getSortedFieldsToShow().map(field => field.name);
        const options = this.searchOptions.filter(option => !(fieldsToShow.indexOf(option.value) > -1));
        options.sort((a, b) => (a.label.toUpperCase() < b.label.toUpperCase() ? -1 : 1));

        const renderCloseableBtn = (name, displayName) => {
            return (
                <div key={name} style={{maxWidth: '300px', margin: '5px 5px'}}>
                    <CloseableBtn
                        title={displayName}
                        value={' = ' + this.props.searchCriteria[name].value}
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
                <div key={name} style={{maxWidth: '300px', margin: '5px 5px'}}>
                    <CloseableBtn
                        title={displayName}
                        value={
                            ' = ' +
                            (this.props.searchCriteria[name].options
                                ? this.props.searchCriteria[name].options.map(({label}) => label).join(', ')
                                : '')
                        }
                        onClick={() => this.selectField(name)}
                        onClose={() => this.removeField(name)}
                        highlighted={this.state.blink === name}
                        id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                    />
                </div>
            );
        };

        const renderCloseableDateTimeBtn = (name, displayName) => {
            function prepareDate(prefix, date) {
                return date ? prefix + ' ' + moment(date).format('L') : '';
            }
            return (
                <div key={name} style={{maxWidth: '330px', margin: '5px 5px'}}>
                    <CloseableBtn
                        title={displayName}
                        onClick={() => this.selectField(name)}
                        onClose={() => this.removeField(name)}
                        highlighted={this.state.blink === name}
                        value={
                            prepareDate(' from', this.props.searchCriteria[name].from) +
                            ' ' +
                            prepareDate('to', this.props.searchCriteria[name].to)
                        }
                        id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                    />
                </div>
            );
        };

        const renderCloseableDateBtn = (name, displayName) => {
            function prepareDate(prefix, date) {
                return date ? prefix + ' ' + moment.utc(date).format('L') : '';
            }
            return (
                <div key={name} style={{maxWidth: '330px', margin: '5px 5px'}}>
                    <CloseableBtn
                        title={displayName}
                        onClick={() => this.selectField(name)}
                        onClose={() => this.removeField(name)}
                        highlighted={this.state.blink === name}
                        value={
                            prepareDate(' from', this.props.searchCriteria[name].from) +
                            ' ' +
                            prepareDate('to', this.props.searchCriteria[name].to)
                        }
                        id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                    />
                </div>
            );
        };

        const renderCloseableDurationBtn = (name, displayName) => {
            function prepareDuration(prefix, value) {
                return value ? prefix + ' ' + value : '';
            }
            return (
                <div key={name} style={{maxWidth: '330px', margin: '5px 5px'}}>
                    <CloseableBtn
                        title={displayName}
                        onClick={() => this.selectField(name)}
                        onClose={() => this.removeField(name)}
                        highlighted={this.state.blink === name}
                        value={
                            prepareDuration(' from', this.props.searchCriteria[name].from) +
                            ' ' +
                            prepareDuration('to', this.props.searchCriteria[name].to)
                        }
                        id={'dashboard-avails-advanced-search-' + name + '-criteria'}
                    />
                </div>
            );
        };

        const renderCloseable = () => {
            if (this.availsMap != null) {
                return Array.from(fieldsToShow).map(key => {
                    const schema = this.availsMap[key];
                    if (ignoreForCloseable.indexOf(key) === -1) {
                        if (schema) {
                            switch (schema.searchDataType) {
                                case 'string':
                                    return renderCloseableBtn(key, schema.displayName);
                                case 'integer':
                                    return renderCloseableBtn(key, schema.displayName);
                                case 'year':
                                    return renderCloseableBtn(key, schema.displayName);
                                case 'double':
                                    return renderCloseableBtn(key, schema.displayName);
                                case 'multiselect':
                                    return renderCloseableSelectBtn(key, schema.displayName);
                                case 'priceType':
                                    return renderCloseableSelectBtn(key, schema.displayName);
                                case 'territoryType':
                                    return renderCloseableSelectBtn(key, schema.displayName);
                                case 'duration':
                                    return renderCloseableDurationBtn(key, schema.displayName);
                                case 'time':
                                    return renderCloseableBtn(key, schema.displayName);
                                case DATETIME_FIELDS.TIMESTAMP:
                                    return renderCloseableDateTimeBtn(key, schema.displayName);
                                case DATETIME_FIELDS.BUSINESS_DATETIME:
                                    return renderCloseableDateTimeBtn(key, schema.displayName);
                                case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
                                    return renderCloseableDateBtn(key, schema.displayName);
                                case 'boolean':
                                    return renderCloseableBtn(key, schema.displayName);
                                default:
                                    // eslint-disable-next-line
                                    console.warn(
                                        'Unsupported searchDataType: ' +
                                            schema.searchDataType +
                                            ' for field name: ' +
                                            schema.displayName
                                    );
                            }
                        } else {
                            if (key !== 'availHistoryIds') {
                                // eslint-disable-next-line
                                console.warn('Cannot determine schema for field: ' + key);
                            }
                        }
                    }
                });
            }
            return null;
        };

        const renderSpecialCloseable = () => {
            let val = '';
            if (this.props.searchCriteria.availHistoryIds) {
                val = this.props.searchCriteria.availHistoryIds.value;
                const data = this.props.historyCache[val];
                if (data) {
                    const subTitle = data.ingestType + ', ';
                    val = subTitle;
                    if (data.ingestType === 'Email') {
                        val += data.provider ? data.provider + ', ' : '';
                    } else {
                        if (data.attachments && data.attachments[0]) {
                            const filename = data.attachments[0].link.split(/(\\|\/)/g).pop();
                            val += filename ? filename + ', ' : '';
                        }
                    }
                    val += moment(data.received).format('llll');
                } else {
                    if (!this.loadingHistoryData[val]) {
                        this.loadingHistoryData[val] = {loading: true};
                        this.getHistoryData(val);
                    }
                }
            }
            return (
                this.props.searchCriteria.availHistoryIds && (
                    <div key={name} style={{maxWidth: '400px', margin: '5px 5px'}}>
                        <CloseableBtn
                            title="Avail History"
                            value={' = ' + val}
                            onClose={() => {
                                this.props.searchFormUpdateAdvancedSearchCriteria({availHistoryIds: null});
                            }}
                            id={'dashboard-avails-advanced-search-' + 'AvailId' + '-criteria'}
                        />
                    </div>
                )
            );
        };
        return (
            <div
                className={'nx-stylish container-fluid vu-advanced-search-panel ' + (this.props.hide ? 'hide' : '')}
                style={{
                    background: 'rgba(0,0,0,0.1)',
                    padding: '1em',
                    overflow: this.props.hide ? 'hidden' : 'visible',
                }}
            >
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
                    id="dashboard-avails-advanced-search-selectable"
                    onChange={this.handleValueChange}
                    onSelect={this.handleSelect}
                    onSave={this.addSearchField}
                />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                    }}
                >
                    {renderSpecialCloseable()}
                    {renderCloseable()}
                </div>
                <div
                    className="mt-2"
                    style={{
                        textAlign: 'right',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        alignContent: 'flex-end',
                        margin: '0px 0px 2px',
                    }}
                >
                    <Button
                        outline
                        color="secondary"
                        id="dashboard-avails-advanced-search-save-btn"
                        onClick={this.handleBulkExport}
                        disabled={!this.props.availTabPage.total}
                        style={{margin: '4px 7px 0'}}
                    >
                        bulk export
                    </Button>
                    <Button
                        outline
                        color="secondary"
                        id="dashboard-avails-advanced-search-save-btn"
                        onClick={this.handleDelete}
                        disabled={!this.props.reportName}
                        style={{width: '80px', margin: '4px 7px 0'}}
                    >
                        delete
                    </Button>
                    <Button
                        outline
                        color="secondary"
                        id="dashboard-avails-advanced-search-clear-btn"
                        onClick={this.handleClear}
                        style={{width: '80px', margin: '4px 7px 0'}}
                    >
                        clear
                    </Button>
                    <Button
                        outline
                        color="secondary"
                        id="dashboard-avails-advanced-search-save-btn"
                        onClick={this.handleSave}
                        style={{width: '80px', margin: '4px 7px 0'}}
                    >
                        save
                    </Button>
                    <Button
                        outline
                        color="secondary"
                        id="dashboard-avails-advanced-search-filter-btn"
                        onClick={this.handleSearch}
                        innerRef={this.refSearchBtn}
                        style={{width: '80px', margin: '4px 7px 0'}}
                    >
                        filter
                    </Button>
                </div>
            </div>
        );
    }
}

AdvancedSearchPanel.propTypes = {
    searchCriteria: PropTypes.object,
    availTabPage: PropTypes.object,
    availTabPageSort: PropTypes.array,
    onSearch: PropTypes.func,
    searchFormUpdateAdvancedSearchCriteria: PropTypes.func,
    onToggleAdvancedSearch: PropTypes.func,
    hide: PropTypes.bool,
    reportName: PropTypes.string,
    availsMapping: PropTypes.object,
    columns: PropTypes.array,
    historyCache: PropTypes.object,
    setHistoryCache: PropTypes.func,
    location: PropTypes.object,
    bulkExportAvailable: PropTypes.bool,
    resultPageSetBulkExport: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchPanel);
