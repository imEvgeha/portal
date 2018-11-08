import './DashboardContainer.scss';

import React from 'react';
import {connect} from 'react-redux';
import FreeTextSearch from './components/FreeTextSearch';
import AdvancedSearchPanel from './components/AdvancedSearchPanel';
import {
    searchFormUseAdvancedSearch,
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    resultPageSelect
} from '../../actions/dashboard';
import DashboardTab from './DashboardTab';
import SearchResultsTab from './SearchResultsTab';
import t from 'prop-types';
import {loadAvailsMapping} from '../../actions';
import {profileService} from './ProfileService';
import {advancedSearchHelper} from './AdvancedSearchHelper';
import {configurationService} from './ConfigurationService';

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
        availsMapping: state.root.availsMapping,
    };
};

const mapDispatchToProps = {
    searchFormShowAdvancedSearch: searchFormUseAdvancedSearch,
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    loadAvailsMapping,
    resultPageSelect
};

class DashboardContainer extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        searchFormShowAdvancedSearch: t.func,
        resultPageLoading: t.func,
        resultPageSort: t.func,
        resultPageUpdate: t.func,
        loadAvailsMapping: t.func,
        resultPageSelect: t.func
    };

    constructor(props) {
        super(props);
        this.state = {
            showAdvancedSearch: false,
            showSearchResults: false
        };
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
        this.handleAvailsFreeTextSearch = this.handleAvailsFreeTextSearch.bind(this);
        this.handleAvailsAdvancedSearch = this.handleAvailsAdvancedSearch.bind(this);
        this.handleBackToDashboard = this.handleBackToDashboard.bind(this);
        this.cleanSelection = this.cleanSelection.bind(this);
    }

    componentDidMount() {
        profileService.initAvailsMapping();
        configurationService.initConfiguration();
    }

    handleBackToDashboard() {
        this.setState({showSearchResults: false, showAdvancedSearch: false});
    }

    toggleAdvancedSearch() {
        this.setState({showAdvancedSearch: !this.state.showAdvancedSearch});
    }

    handleAvailsFreeTextSearch(searchCriteria) {
        this.props.searchFormShowAdvancedSearch(false);
        advancedSearchHelper.freeTextSearch(searchCriteria);
        this.setState({showSearchResults: true});
        this.cleanSelection();
    }

    handleAvailsAdvancedSearch(searchCriteria) {
        this.props.searchFormShowAdvancedSearch(true);
        advancedSearchHelper.advancedSearch(searchCriteria);
        this.setState({showSearchResults: true});
        this.cleanSelection();
    }

    cleanSelection() {
        let availTabPageSelection = {
            selected: [],
            selectAll: false
        };
        this.props.resultPageSelect(availTabPageSelection);
    }

    render() {
        return (
            <div>
                <div className={'container-fluid vu-free-text-search ' + (this.state.showAdvancedSearch ? 'hide': '')}>
                    <div>
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        <FreeTextSearch disabled={this.state.showAdvancedSearch} containerId={'dashboard-avails'}
                                            onSearch={this.handleAvailsFreeTextSearch}/>
                                    </td>
                                    <td style={{width: '20px', height: '30px', paddingLeft: '8px'}}>
                                        <button className="btn btn-outline-secondary advanced-search-btn" style={{height: '40px'}} title={'Advanced search'}
                                            id={'dashboard-avails-advanced-search-btn'} onClick={this.toggleAdvancedSearch}>
                                            <i className="fas fa-filter table-top-icon" style={{fontSize: '1.25em', marginLeft: '-3px', marginTop: '6px', padding: '0px'}}> </i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {<AdvancedSearchPanel hide={!this.state.showAdvancedSearch} onSearch={this.handleAvailsAdvancedSearch} onToggleAdvancedSearch={this.toggleAdvancedSearch}/>}
                {!this.state.showSearchResults && <DashboardTab/>}
                {this.state.showSearchResults && <SearchResultsTab onBackToDashboard={this.handleBackToDashboard}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);