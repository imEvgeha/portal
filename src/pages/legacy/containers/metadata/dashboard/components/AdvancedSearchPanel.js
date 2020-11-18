import React from 'react';
import {searchFormUpdateAdvancedSearchCriteria} from '../../../../stores/actions/metadata/index';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {titleSearchHelper} from '../TitleSearchHelper';
import {alertModal} from '../../../../components/modal/AlertModal';
import {confirmModal} from '../../../../components/modal/ConfirmModal';
import moment from 'moment';
import CloseableBtn from '../../../../components/form/CloseableBtn';
import SelectableInput from '../../../../components/form/SelectableInput';
import {titleMapping} from '../../service/Profile';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';

const mapStateToProps = state => {
    return {
        titleTabPage: state.titleReducer.titleTabPage,
        searchCriteria: state.titleReducer.session.advancedSearchCriteria,
    };
};

const mapDispatchToProps = {
    searchFormUpdateAdvancedSearchCriteria,
};

const ignoreForCloseable = ['rowInvalid'];

class AdvancedSearchPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            value: null,
            blink: null,
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.addSearchField = this.addSearchField.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.blink = this.blink.bind(this);
        this.refSearchBtn = React.createRef();
        this.removeField = this.removeField.bind(this);

        this.titleMap = null;
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
        this.refSearchBtn.current.focus();
    }

    handleBulkExport() {
        if (!this.props.titleTabPage.total) {
            alertModal.open('Action required', () => {}, {
                description: 'There is no result of search, please change filters.',
            });
        } else if (this.props.titleTabPage.total > 50000) {
            alertModal.open('Action required', () => {}, {
                description: 'You have more that 50000 titles, please change filters',
            });
        } else {
            confirmModal.open('Confirm download', this.bulkExport, () => {}, {
                description: `You have ${this.props.titleTabPage.total} titles for download.`,
            });
        }
    }

    handleClear() {
        this.handleSelect(null);
        titleSearchHelper.clearAdvancedSearchForm();
    }

    handleSearch() {
        if (!this.isAnyValueSpecified()) {
            this.setState({selected: null, value: null});
        }
        this.setState({blink: null});
        this.props.onSearch(this.props.searchCriteria);
    }

    isAnyValueSpecified = () => {
        const value = this.state.value;
        return value && (value.from || value.to || (value.value && value.value.trim()));
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

    render() {
        if (titleMapping && this.titleMap === null) {
            this.titleMap = {};
            this.searchOptions = [];
            titleMapping.mappings.forEach(mapping => {
                this.titleMap[mapping.javaVariableName] = mapping;
                if (mapping.fullTextSearch === 'true') {
                    this.searchOptions.push({value: mapping.javaVariableName, label: mapping.displayName});
                }
            });
        }

        const fieldsToShow = this.getSortedFieldsToShow().map(field => field.name);
        const options = this.searchOptions.filter(option => !(fieldsToShow.indexOf(option.value) > -1));

        const renderCloseableBtn = (name, displayName) => {
            return (
                <div key={name} style={{maxWidth: '300px', margin: '5px 5px'}}>
                    <CloseableBtn
                        title={displayName}
                        value={' = ' + this.props.searchCriteria[name].value}
                        onClick={() => this.selectField(name)}
                        onClose={() => this.removeField(name)}
                        highlighted={this.state.blink === name}
                        id={'dashboard-title-advanced-search-' + name + '-criteria'}
                    />
                </div>
            );
        };

        const renderCloseableDateBtn = (name, displayName) => {
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
                        id={'dashboard-title-advanced-search-' + name + '-criteria'}
                    />
                </div>
            );
        };

        const renderCloseable = () => {
            if (this.titleMap != null) {
                return Array.from(fieldsToShow).map(key => {
                    const schema = this.titleMap[key];
                    if (ignoreForCloseable.indexOf(key) === -1) {
                        if (schema) {
                            if (schema.dataType === DATETIME_FIELDS.REGIONAL_MIDNIGHT) {
                                return renderCloseableDateBtn(key, schema.displayName);
                            } else {
                                return renderCloseableBtn(key, schema.displayName);
                            }
                        } else {
                            // eslint-disable-next-line
                            console.warn('Cannot determine schema for field: ' + key);
                        }
                    }
                });
            }
            return null;
        };

        const renderSpecialCloseable = () => {
            return (
                this.props.searchCriteria.titleHistoryIds && (
                    <div key={name} style={{maxWidth: '400px', margin: '5px 5px'}}>
                        <CloseableBtn
                            title="Title History"
                            value={' = ' + this.props.searchCriteria.titleHistoryIds.subTitle}
                            onClose={() => this.props.searchFormUpdateAdvancedSearchCriteria({titleHistoryIds: null})}
                            id={'dashboard-title-advanced-search-' + 'TitleId' + '-criteria'}
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
                    selected={this.state.selected}
                    value={this.state.value}
                    dataType={this.state.selected ? this.titleMap[this.state.selected.value].dataType : null}
                    displayName={this.state.selected ? this.titleMap[this.state.selected.value].displayName : null}
                    id="dashboard-title-advanced-search-selectable"
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
            </div>
        );
    }
}

AdvancedSearchPanel.propTypes = {
    searchCriteria: PropTypes.object,
    titleTabPage: PropTypes.object,
    onSearch: PropTypes.func,
    searchFormUpdateAdvancedSearchCriteria: PropTypes.func,
    onToggleAdvancedSearch: PropTypes.func,
    hide: PropTypes.bool,
};
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchPanel);
