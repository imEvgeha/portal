import React from 'react';
import {Button} from 'reactstrap';
import {
    searchFormUpdateAdvancedHistorySearchCriteria
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
    searchFormUpdateAdvancedHistorySearchCriteria,
};

class AdvancedHistorySearchPanel extends React.Component {
    static propTypes = {
        searchCriteria: t.object,
        onSearch: t.func,
        searchFormUpdateAdvancedHistorySearchCriteria: t.func
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
        this.handleDateValidate = this.handleDateValidate.bind(this);
        this.handleStateSelect = this.handleStateSelect.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.props.searchFormUpdateAdvancedHistorySearchCriteria({...this.props.searchCriteria, [name]: value});
        this.setState({invalidForm: !this.validateState(this.state.invalid)});
    }

    handleDateChange(name, value) {
        this.props.searchFormUpdateAdvancedHistorySearchCriteria({...this.props.searchCriteria, [name]: value});
    }

    handleDateValidate(name, value) {
        const state = {invalid: {...this.state.invalid, [name]: value}};
        state.invalidForm = !this.validateState(state.invalid);
        this.setState(state);
    }

    handleStateSelect(option){
        this.props.searchFormUpdateAdvancedHistorySearchCriteria({...this.props.searchCriteria, state: option.value});
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
        this.props.onSearch(this.props.searchCriteria);
    }

    render() {
        const renderTextField = (name, displayName) => {
            return (<div key={name} style={{ maxWidth:'300px', minWidth:'300px', flex:'1 1 300px', margin:'0 10px'}}>
                <label htmlFor={'dashboard-avails-search-' + name + '-text'}>{displayName}</label>
                <input type="text" className="form-control"
                       id={'dashboard-avails-search-' + name + '-text'}
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
                displayName={displayName}
                fromDate={this.props.searchCriteria[name + 'From']}
                toDate={this.props.searchCriteria[name + 'To']}
                onFromDateChange={(value) => this.handleDateChange(name +'From', value)}
                onToDateChange={(value) => this.handleDateChange(name + 'To', value)}
                onValidate={(value) => this.handleDateValidate(name, value)}
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
                        <label htmlFor={'dashboard-avails-search-state-text'}>State</label>
                        <Select
                            id={'statusSelect'}
                            onChange={this.handleStateSelect}
                            options={options}
                            value ={options.filter(option => option.value === this.props.searchCriteria.state)}
                        > </Select>
                    </div>
                </div>
                <div>
                     <div style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-end', alignItems:'flex-start', alignContent:'flex-end', margin: '8px 0px 0px'}}>
                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-clear-btn'} onClick={this.handleClear}
                                 style={{width: '80px', margin: '4px 7px 0'}}>clear</Button>

                         <Button outline color="secondary" id={'dashboard-avails-advanced-search-filter-btn'} onClick={this.handleSearch}
                                 disabled={this.state.invalidForm}
                                 style={{width: '80px', margin: '4px 7px 0'}}>filter</Button>
                     </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedHistorySearchPanel);