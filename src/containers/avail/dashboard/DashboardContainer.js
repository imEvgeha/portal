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
    resultPageSelect,
    searchFormShowSearchResults,
    searchFormShowAdvancedSearch,
    searchFormSetAdvancedSearchCriteria
} from '../../../stores/actions/avail/dashboard';
import DashboardTab from './DashboardTab';
import SearchResultsTab from './SearchResultsTab';
import t from 'prop-types';
import {
    loadAvailsMapping,
    updateBreadcrumb
} from '../../../stores/actions/index';
import {profileService} from '../service/ProfileService';
import {availSearchHelper} from './AvailSearchHelper';
import {configurationService} from '../service/ConfigurationService';
import moment from 'moment';

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
        availsMapping: state.root.availsMapping,
        selected: state.dashboard.session.availTabPageSelection.selected,
        showAdvancedSearch: state.dashboard.session.showAdvancedSearch,
        showSearchResults: state.dashboard.session.showSearchResults,
        searchCriteria: state.dashboard.session.advancedSearchCriteria,
        useAdvancedSearch: state.dashboard.session.useAdvancedSearch,
    };
};

const mapDispatchToProps = {
    searchFormUseAdvancedSearch,
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    loadAvailsMapping,
    resultPageSelect,
    searchFormShowAdvancedSearch,
    searchFormShowSearchResults,
    searchFormSetAdvancedSearchCriteria,
    updateBreadcrumb,
};

class DashboardContainer extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        searchCriteria: t.any,
        searchFormUseAdvancedSearch: t.func,
        resultPageLoading: t.func,
        resultPageSort: t.func,
        resultPageUpdate: t.func,
        loadAvailsMapping: t.func,
        resultPageSelect: t.func,
        searchFormShowAdvancedSearch: t.func,
        searchFormShowSearchResults: t.func,
        searchFormSetAdvancedSearchCriteria: t.func,
        updateBreadcrumb: t.func,
        selected: t.array,
        showAdvancedSearch: t.bool,
        showSearchResults: t.bool,
        useAdvancedSearch: t.bool,
        location: t.object,
    };

    fromHistory = false;

    constructor(props) {
        super(props);
        this.state = {};
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
        this.handleAvailsFreeTextSearch = this.handleAvailsFreeTextSearch.bind(this);
        this.handleAvailsAdvancedSearch = this.handleAvailsAdvancedSearch.bind(this);
        this.handleBackToDashboard = this.handleBackToDashboard.bind(this);
        this.cleanSelection = this.cleanSelection.bind(this);
    }

    componentDidMount() {
        profileService.initAvailsMapping();
        configurationService.initConfiguration();
        if (this.props.location && this.props.location.state) {
            const state = this.props.location.state;
            if (state.availHistory) {
                let subTitle = state.availHistory.ingestType + ', ';
                if(state.availHistory.ingestType === 'Email'){
                    subTitle += (state.availHistory.provider ? state.availHistory.provider + ', ' : '')
                }else{
                    if(state.availHistory.attachments && state.availHistory.attachments[0]){
                        const filename = state.availHistory.attachments[0].link.split(/(\\|\/)/g).pop();
                        subTitle += (filename ? filename + ', ' : '')
                    }
                }
                subTitle += moment(state.availHistory.received).format('llll');
                const criteria = {availHistoryIds: {value: state.availHistory.id, subTitle}};
                if (state.rowInvalid !== undefined) {
                    criteria.rowInvalid = {value: state.rowInvalid};
                }
                this.props.searchFormShowAdvancedSearch(true);
                this.props.searchFormSetAdvancedSearchCriteria(criteria);
                this.handleAvailsAdvancedSearch(criteria);
                this.props.updateBreadcrumb([{name: 'Avail Ingest History', path: 'avail-ingest-history'}, {name: 'Search Results'}]);
                this.fromHistory = true;
            } else if (state.back) {
                this.handleBackToDashboard();
            }
        } else if (this.props.searchCriteria.availHistoryIds) {
            if (this.props.showSearchResults) {
                this.props.updateBreadcrumb([{name: 'Avail Ingest History', path: 'avail-ingest-history'}, {name: 'Search Results'}]);
            } else {
                this.props.updateBreadcrumb([{name: 'Dashboard', path: '/dashboard'}]);
            }
        } else {
            this.props.updateBreadcrumb([{name: 'Dashboard', path: '/dashboard'}]);
        }
    }

    componentDidUpdate() {
        if (this.props.searchCriteria.availHistoryIds && this.props.showSearchResults && this.props.useAdvancedSearch && !this.fromHistory) {
            this.props.updateBreadcrumb([{name: 'Avail Ingest History', path: 'avail-ingest-history'}, {name: 'Search Results'}]);
            this.fromHistory = true;
        }
    }

    handleBackToDashboard() {
        this.props.searchFormShowAdvancedSearch(false);
        this.props.searchFormShowSearchResults(false);
        this.props.updateBreadcrumb([{name: 'Dashboard', path: '/dashboard'}]);
    }

    toggleAdvancedSearch() {
        this.props.searchFormShowAdvancedSearch(!this.props.showAdvancedSearch);
    }

    handleAvailsFreeTextSearch(searchCriteria) {
        this.props.searchFormUseAdvancedSearch(false);
        this.props.searchFormShowSearchResults(true);
        this.props.updateBreadcrumb([{name: 'Dashboard', path: '/dashboard', onClick: () => this.handleBackToDashboard()}, {name: 'Search Results'}]);
        availSearchHelper.freeTextSearch(searchCriteria);
        this.cleanSelection();
    }

    handleAvailsAdvancedSearch(searchCriteria) {
        this.props.searchFormUseAdvancedSearch(true);
        this.props.searchFormShowSearchResults(true);
        if (!this.props.searchCriteria.availHistoryIds) {
            this.props.updateBreadcrumb([{name: 'Dashboard', path: 'dashboard'}, {name: 'Search Results'}]);
        }
        availSearchHelper.advancedSearch(searchCriteria);
        this.cleanSelection();
    }

    cleanSelection() {
        let availTabPageSelection = {
            selected: this.props.selected,
            selectAll: false
        };
        this.props.resultPageSelect(availTabPageSelection);
    }

    render() {
        return (
            <div>
                <div className={'container-fluid vu-free-text-search ' + (this.props.showAdvancedSearch ? 'hide': '')}>
                    <div>
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        <FreeTextSearch disabled={this.props.showAdvancedSearch} containerId={'dashboard-avails'}
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
                {<AdvancedSearchPanel hide={!this.props.showAdvancedSearch} onSearch={this.handleAvailsAdvancedSearch} onToggleAdvancedSearch={this.toggleAdvancedSearch}/>}
                {!this.props.showSearchResults && <DashboardTab/>}
                {this.props.showSearchResults && this.props.availsMapping && <SearchResultsTab/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);