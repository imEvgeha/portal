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
} from '../../../stores/actions/metadata/index';
import DashboardTab from './DashboardTab';
import SearchResultsTab from './SearchResultsTab';
import t from 'prop-types';
import {titleSearchHelper} from '../dashboard/TitleSearchHelper';
import { 
    BREADCRUMB_METADATA_DASHBOARD_PATH,
    BREADCRUMB_METADATA_SEARCH_RESULTS_NO_PATH,
    BREADCRUMB_METADATA_TITLE_HISTORY_PATH, 
    BREADCRUMB_METADATA_SEARCH_RESULTS_PATH} from '../../../constants/metadata-breadcrumb-paths';
import moment from 'moment';
import NexusBreadcrumb from '../../NexusBreadcrumb';

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
        selected: state.titleReducer.session.titleTabPageSelection.selected,
        showAdvancedSearch: state.titleReducer.session.showAdvancedSearch,
        showSearchResults: state.titleReducer.session.showSearchResults,
        searchCriteria: state.titleReducer.session.advancedSearchCriteria,
        useAdvancedSearch: state.titleReducer.session.useAdvancedSearch,
    };
};

const mapDispatchToProps = {
    searchFormUseAdvancedSearch,
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    resultPageSelect,
    searchFormShowAdvancedSearch,
    searchFormShowSearchResults,
    searchFormSetAdvancedSearchCriteria
};

class DashboardContainer extends React.Component {
    static propTypes = {
        searchCriteria: t.any,
        searchFormUseAdvancedSearch: t.func,
        resultPageLoading: t.func,
        resultPageSort: t.func,
        resultPageUpdate: t.func,
        resultPageSelect: t.func,
        searchFormShowAdvancedSearch: t.func,
        searchFormShowSearchResults: t.func,
        searchFormSetAdvancedSearchCriteria: t.func,
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
        this.handleTitleFreeTextSearch = this.handleTitleFreeTextSearch.bind(this);
        this.handleTitleAdvancedSearch = this.handleTitleAdvancedSearch.bind(this);
        this.handleBackToDashboard = this.handleBackToDashboard.bind(this);
        this.cleanSelection = this.cleanSelection.bind(this);
    }

    componentDidMount() {   
        if (this.props.location && this.props.location.state) {
            const state = this.props.location.state;
            if (state.titleHistory) {
                const subTitle = state.titleHistory.ingestType + ', ' + (state.titleHistory.provider ? state.titleHistory.provider + ', ' : '') + moment(state.titleHistory.received).format('llll');
                const criteria = {titleHistoryIds: {value: state.titleHistory.id, subTitle}};
                if (state.rowInvalid !== undefined) {
                    criteria.rowInvalid = {value: state.rowInvalid};
                }
                this.props.searchFormShowAdvancedSearch(true);
                this.props.searchFormSetAdvancedSearchCriteria(criteria);
                this.handleTitleAdvancedSearch(criteria);
                NexusBreadcrumb.push([BREADCRUMB_METADATA_TITLE_HISTORY_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_NO_PATH]);
                this.fromHistory = true;
            } else if (state.back) {
                this.handleBackToDashboard();
            }
        } else if (this.props.searchCriteria.availHistoryIds) {
            if (this.props.showSearchResults) {
                NexusBreadcrumb.push([BREADCRUMB_METADATA_TITLE_HISTORY_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_PATH]);
            }
        } else {
            if(this.props.showSearchResults) {
                NexusBreadcrumb.push([BREADCRUMB_METADATA_TITLE_HISTORY_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_NO_PATH]);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchCriteria.titleHistoryIds && this.props.showSearchResults && this.props.useAdvancedSearch && !this.fromHistory) {       
            NexusBreadcrumb.push([BREADCRUMB_METADATA_TITLE_HISTORY_PATH, BREADCRUMB_METADATA_SEARCH_RESULTS_NO_PATH]);
            this.fromHistory = true;
        }

        if(prevProps.searchCriteria !== this.props.searchCriteria) {
            NexusBreadcrumb.set(BREADCRUMB_METADATA_DASHBOARD_PATH);

            if (this.props.showSearchResults) {
                if(this.props.showAdvancedSearch){
                    NexusBreadcrumb.push(BREADCRUMB_METADATA_TITLE_HISTORY_PATH);
                }
                NexusBreadcrumb.push(BREADCRUMB_METADATA_SEARCH_RESULTS_NO_PATH);
            }
        }
    }

    handleBackToDashboard() {
        this.props.searchFormShowAdvancedSearch(false);
        this.props.searchFormShowSearchResults(false);
        NexusBreadcrumb.set(BREADCRUMB_METADATA_DASHBOARD_PATH);
    }

    toggleAdvancedSearch() {
        this.props.searchFormShowAdvancedSearch(!this.props.showAdvancedSearch);
    }

    handleTitleFreeTextSearch(searchCriteria) {
        // this.props.searchFormUseAdvancedSearch(false);
        this.props.searchFormShowSearchResults(true);        
        NexusBreadcrumb.set([{name: 'Dashboard', path: '/metadata', onClick: () => this.handleBackToDashboard()}, {name: 'Search Results'}]);
        titleSearchHelper.freeTextSearch(searchCriteria);
        this.cleanSelection();
    }

    handleTitleAdvancedSearch(searchCriteria) {
        this.props.searchFormUseAdvancedSearch(true);
        this.props.searchFormShowSearchResults(true);
        if (!this.props.searchCriteria.titleHistoryIds) {        
            NexusBreadcrumb.set([BREADCRUMB_METADATA_DASHBOARD_PATH]);  
        }
        titleSearchHelper.advancedSearch(searchCriteria);
        this.cleanSelection();
    }

    cleanSelection() {
        let titleTabPageSelection = {
            selected: this.props.selected,
            selectAll: false
        };
        this.props.resultPageSelect(titleTabPageSelection);
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
                                        <FreeTextSearch disabled={this.props.showAdvancedSearch} containerId={'dashboard-title'}
                                            onSearch={this.handleTitleFreeTextSearch}/>
                                    </td>
                                    <td style={{width: '20px', height: '30px', paddingLeft: '8px'}}>
                                        <button className="btn btn-outline-secondary advanced-search-btn" style={{height: '40px'}} title={'Advanced search'}
                                            id={'dashboard-title-advanced-search-btn'} onClick={this.toggleAdvancedSearch}>
                                            <i className="fas fa-filter table-top-icon" style={{fontSize: '1.25em', marginLeft: '-3px', marginTop: '6px', padding: '0px'}}> </i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {<AdvancedSearchPanel hide={!this.props.showAdvancedSearch} onSearch={this.handleTitleAdvancedSearch} onToggleAdvancedSearch={this.toggleAdvancedSearch}/>}
                <DashboardTab/>
                <SearchResultsTab/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);