import './DashboardContainer.scss';

import React from 'react';
import {connect} from 'react-redux';
import {IfEmbedded, URL} from '../../../util/Common';
import FreeTextSearch from './components/FreeTextSearch';
import AdvancedSearchPanel from './components/AdvancedSearchPanel';
import {
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    searchFormShowSearchResults,
    searchFormShowAdvancedSearch,
    searchFormSetAdvancedSearchCriteria,
    searchFormUpdateAdvancedSearchCriteria,
    resultPageShowSelected,
    searchFormUpdateTextSearch
} from '../../../stores/actions/avail/dashboard';
import DashboardTab from './DashboardTab';
import SearchResultsTab from './SearchResultsTab';
import t from 'prop-types';
import {profileService} from '../service/ProfileService';
import {rightSearchHelper} from './RightSearchHelper';
import {configurationService} from '../service/ConfigurationService';
import moment from 'moment';
import {AVAILS_DASHBOARD, AVAILS_SEARCH_RESULTS, AVAILS_HISTORY} from '../../../constants/breadcrumb';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {gotoAvailsDashboard} from '../../Navbar';
import {isObjectEmpty} from '../../../util/Common';
import RightsURL from '../util/RightsUtils';
import store from '../../../stores';

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
        availsMapping: state.root.availsMapping,
        selected: state.dashboard.session.availTabPageSelection.selected,
        showAdvancedSearch: state.dashboard.session.showAdvancedSearch,
        showSearchResults: state.dashboard.session.showSearchResults,
        searchCriteria: state.dashboard.session.advancedSearchCriteria,
        currentSearchCriteria: state.dashboard.session.searchCriteria,
    };
};

const mapDispatchToProps = {
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    searchFormShowAdvancedSearch,
    searchFormShowSearchResults,
    searchFormSetAdvancedSearchCriteria,
    resultPageShowSelected,
    searchFormUpdateAdvancedSearchCriteria,
    searchFormUpdateTextSearch
};

class DashboardContainer extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        searchCriteria: t.any,
        currentSearchCriteria: t.any,
        resultPageLoading: t.func,
        resultPageSort: t.func,
        resultPageUpdate: t.func,
        searchFormUpdateTextSearch: t.func,
        searchFormShowAdvancedSearch: t.func,
        searchFormShowSearchResults: t.func,
        searchFormSetAdvancedSearchCriteria: t.func,
        searchFormUpdateAdvancedSearchCriteria: t.func,
        selected: t.array,
        showAdvancedSearch: t.bool,
        showSearchResults: t.bool,
        location: t.object,
        match: t.object,
        resultPageShowSelected: t.func
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
        this.handleAvailsFreeTextSearch = this.handleAvailsFreeTextSearch.bind(this);
        this.handleAvailsAdvancedSearch = this.handleAvailsAdvancedSearch.bind(this);
    }

    componentDidMount() {
        NexusBreadcrumb.set(AVAILS_DASHBOARD);
        profileService.initAvailsMapping();
        configurationService.initConfiguration();

        this.getSearchCriteriaFromURL();

        // if (this.props.location && this.props.location.state) {
        //     const state = this.props.location.state;
        //     if (state.availHistory) {
        //         let subTitle = state.availHistory.ingestType + ', ';
        //         if(state.availHistory.ingestType === 'Email'){
        //             subTitle += (state.availHistory.provider ? state.availHistory.provider + ', ' : '');
        //         }else{
        //             if(state.availHistory.attachments && state.availHistory.attachments[0]){
        //                 const filename = state.availHistory.attachments[0].link.split(/(\\|\/)/g).pop();
        //                 subTitle += (filename ? filename + ', ' : '');
        //             }
        //         }
        //         subTitle += moment(state.availHistory.received).format('llll');
        //         const criteria = {availHistoryIds: {value: state.availHistory.id, subTitle}};
        //         if (state.invalid !== undefined) {
        //             criteria.invalid = {value: state.invalid};
        //         }
        //
        //         this.props.searchFormShowAdvancedSearch(true);
        //         this.props.searchFormSetAdvancedSearchCriteria(criteria);
        //         this.handleAvailsAdvancedSearch(criteria);
        //     }
        // }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.availsMapping !== this.props.availsMapping) {
            this.getSearchCriteriaFromURL();
        }
    }

    getSearchCriteriaFromURL(){
        if(!this.props.availsMapping) {
            return false;
        }

        if(this.props.match.path === RightsURL.availsDashboardUrl){
            this.props.searchFormShowSearchResults(false);
        }else{
            const params = RightsURL.URLtoArray(this.props.location.search, this.props.match.params);
            let criteria = {text: ''};
            if(!isObjectEmpty(this.props.match.params) || RightsURL.isAdvancedFilter(this.props.location.search)){
                criteria = RightsURL.ArraytoFilter(params);
                this.props.searchFormShowAdvancedSearch(true);
                this.props.searchFormSetAdvancedSearchCriteria(criteria);
                this.handleAvailsAdvancedSearch(criteria);
            }else{
                const simpleFilter = params.find(param => param.split('=')[0] === 'text');
                if(simpleFilter && simpleFilter.split('=').length === 2) {
                    criteria = {text: simpleFilter.split('=')[1]};
                }
                this.props.searchFormShowAdvancedSearch(false);
                this.props.searchFormUpdateTextSearch(criteria);
                this.handleAvailsFreeTextSearch(criteria);
            }
        }
    }

    toggleAdvancedSearch() {
        this.props.searchFormShowAdvancedSearch(!this.props.showAdvancedSearch);
    }

    handleAvailsFreeTextSearch(searchCriteria) {
        NexusBreadcrumb.set([AVAILS_DASHBOARD, AVAILS_SEARCH_RESULTS]);
        this.props.resultPageShowSelected(false);
        this.props.searchFormShowSearchResults(true);
        rightSearchHelper.freeTextSearch(searchCriteria);
    }

    handleAvailsAdvancedSearch(searchCriteria) {
        if (this.props.searchCriteria.availHistoryIds) {
            NexusBreadcrumb.set([AVAILS_DASHBOARD, AVAILS_HISTORY, AVAILS_SEARCH_RESULTS]);
        }else{
            NexusBreadcrumb.set([AVAILS_DASHBOARD, AVAILS_SEARCH_RESULTS]);
        }

        this.props.resultPageShowSelected(false);
        this.props.searchFormShowSearchResults(true);

        rightSearchHelper.advancedSearch(searchCriteria);
    }

    render() {
        return (
            <div>
                <RightsURL/>
                <IfEmbedded value={false}>
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
                </IfEmbedded>
                {this.props.showSearchResults && this.props.availsMapping && <SearchResultsTab/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);