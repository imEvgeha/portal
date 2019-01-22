import React from 'react';
import {Button} from 'reactstrap';
import {
    searchFormSetAdvancedHistorySearchCriteria
} from '../../../actions/history';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import RangeDatapicker from '../../../components/fields/RangeDatapicker';
import {advancedHistorySearchHelper} from '../AdvancedHistorySearchHelper';
import Select from 'react-select';

const mapStateToProps = state => {
    return {
        searchCriteria: state.history.session.advancedSearchCriteria,
    };
};

const mapDispatchToProps = {
    searchFormSetAdvancedHistorySearchCriteria,
};

class AdvancedHistorySearchPanel extends React.Component {
    static propTypes = {
        searchCriteria: t.object,
        onSearch: t.func,
        searchFormSetAdvancedHistorySearchCriteria: t.func
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
            invalidForm: false
        };
        this.validateState = this.validateState.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateInvalid = this.handleDateInvalid.bind(this);
        this.handleStateSelect = this.handleStateSelect.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.props.searchFormSetAdvancedHistorySearchCriteria({...this.props.searchCriteria, [name]: value});
        this.setState({invalidForm: !this.validateState(this.state.invalid)});
    }

    handleDateChange(name, field, value) {
        this.props.searchFormSetAdvancedHistorySearchCriteria({...this.props.searchCriteria, [name]: {...this.props.searchCriteria[name], [field] : value}});

    }

    handleDateInvalid(name, value) {
        const state = {invalid: {...this.state.invalid, [name]: value}};
        state.invalidForm = !this.validateState(state.invalid);
        this.setState(state);
    }

    handleStateSelect(option){
        this.props.searchFormSetAdvancedHistorySearchCriteria({...this.props.searchCriteria, status: option.value});
    }

    validateState(invalidState) {
        for (let key of Object.keys(invalidState)) {
            if (invalidState[key]) { return false; }
        }
        return true;
    }

    handleClear() {
        advancedHistorySearchHelper.clearAdvancedHistorySearchForm();
    }

    handleSearch() {
        const criteria = {...this.props.searchCriteria};
        if (criteria.provider) {
            criteria.provider = criteria.provider.trim();
            this.props.searchFormSetAdvancedHistorySearchCriteria(criteria);
        }
        this.props.onSearch(criteria);
    }

    render() {
        const renderTextField = (name, displayName) => {
            return (<div key={name} style={{ maxWidth:'300px', minWidth:'300px', flex:'1 1 300px', margin:'0 10px'}}>
                <label htmlFor={'avail-ingest-history-search-' + name + '-text'}>{displayName}</label>
                <input type="text" className="form-control"
                       id={'avail-ingest-history-search-' + name + '-text'}
                       placeholder={'Enter ' + displayName}
                       name={name}
                       value={this.props.searchCriteria[name]}
                       onChange={this.handleInputChange}
                       onKeyPress={this._handleKeyPress}/>
            </div>);
        };

        const renderRangeDatepicker = (name, displayName) => {
            return (<RangeDatapicker
                key={name}
                id={'avails-ingest-history-search-' + name}
                displayName={displayName}
                value={this.props.searchCriteria[name] ? this.props.searchCriteria[name] : {}}
                onFromDateChange={(value) => this.handleDateChange(name, 'from', value)}
                onToDateChange={(value) => this.handleDateChange(name, 'to', value)}
                onInvalid={(value) => this.handleDateInvalid(name, value)}
                handleKeyPress={this._handleKeyPress}
            />);
        };

        let searchFields = [];
        searchFields.push(renderTextField('provider', 'Provider'));
        searchFields.push(renderRangeDatepicker('received', 'Avail Delivery Date'));

        let options = [
            { value: '', label: 'ALL' },
            { value: 'PENDING', label: 'PENDING' },
            { value: 'COMPLETED', label: 'COMPLETED' },
            { value: 'FAILED', label: 'FAILED' },
        ];

        return (
            <div className={'nx-stylish container-fluid vu-advanced-history-search-panel'}
                 style={{background: 'rgba(0,0,0,0.1)', padding: '1em'}}>
                <div style={{ display:'flex', flex: 1, flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start',  alignItems:'flex-start'}}>
                    {searchFields}
                    <div style={{ maxWidth:'300px', minWidth:'300px', flex:'1 1 300px', margin:'0 10px'}}>
                        <label htmlFor={'avail-ingest-history-search-state-text'}>Status</label>
                        <Select
                            id={'avail-ingest-history-search-state-select'}
                            onChange={this.handleStateSelect}
                            options={options}
                            value ={options.filter(option => option.value === this.props.searchCriteria.status)}
                        > </Select>
                    </div>
                </div>
                <div>
                     <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-end', alignItems:'flex-start', alignContent:'flex-end', margin: '8px 0px 0px'}}>
                         <Button outline color="secondary" id={'avail-ingest-history-avails-advanced-search-clear-btn'} onClick={this.handleClear}
                                 style={{width: '80px', margin: '4px 7px 0'}}>clear</Button>

                         <Button outline color="secondary" id={'avail-ingest-history-avails-advanced-search-filter-btn'} onClick={this.handleSearch}
                                 disabled={this.state.invalidForm}
                                 style={{width: '80px', margin: '4px 7px 0'}}>filter</Button>
                     </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedHistorySearchPanel);