import './DashboardContainer.scss';

import React from 'react';
import {connect} from 'react-redux';
import FreeTextSearch from './components/FreeTextSearch';
import AdvancedSearchPanel from './components/AdvancedSearchPanel';
import {
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
    loadAvailsMapping
} from '../../../stores/actions/index';
import {profileService} from '../service/ProfileService';
import {availSearchHelper} from './AvailSearchHelper';
import {configurationService} from '../service/ConfigurationService';
import moment from 'moment';
import {AVAILS_DASHBOARD, AVAILS_SEARCH_RESULTS, AVAILS_HISTORY} from '../../../constants/breadcrumb';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {gotoAvailsDashboard} from '../../Navbar';

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
    loadAvailsMapping,
    resultPageSelect,
    searchFormShowAdvancedSearch,
    searchFormShowSearchResults,
    searchFormSetAdvancedSearchCriteria
};

class DashboardContainer extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        searchCriteria: t.any,
        currentSearchCriteria: t.any,
        resultPageLoading: t.func,
        resultPageSort: t.func,
        resultPageUpdate: t.func,
        loadAvailsMapping: t.func,
        resultPageSelect: t.func,
        searchFormShowAdvancedSearch: t.func,
        searchFormShowSearchResults: t.func,
        searchFormSetAdvancedSearchCriteria: t.func,
        selected: t.array,
        showAdvancedSearch: t.bool,
        showSearchResults: t.bool,
        location: t.object,
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
        this.handleAvailsFreeTextSearch = this.handleAvailsFreeTextSearch.bind(this);
        this.handleAvailsAdvancedSearch = this.handleAvailsAdvancedSearch.bind(this);
        this.cleanSelection = this.cleanSelection.bind(this);
    }

    componentDidMount() {
        NexusBreadcrumb.set(AVAILS_DASHBOARD);
        profileService.initAvailsMapping();
        configurationService.initConfiguration();
        if (this.props.location && this.props.location.state) {
            const state = this.props.location.state;
            if (state.availHistory) {
                let subTitle = state.availHistory.ingestType + ', ';
                if(state.availHistory.ingestType === 'Email'){
                    subTitle += (state.availHistory.provider ? state.availHistory.provider + ', ' : '');
                }else{
                    if(state.availHistory.attachments && state.availHistory.attachments[0]){
                        const filename = state.availHistory.attachments[0].link.split(/(\\|\/)/g).pop();
                        subTitle += (filename ? filename + ', ' : '');
                    }
                }
                subTitle += moment(state.availHistory.received).format('llll');
                const criteria = {availHistoryIds: {value: state.availHistory.id, subTitle}};
                if (state.rowInvalid !== undefined) {
                    criteria.rowInvalid = {value: state.rowInvalid};
                }

                if(this.props.showSearchResults) {
                    NexusBreadcrumb.push([AVAILS_HISTORY, AVAILS_SEARCH_RESULTS]);
                }

                this.props.searchFormShowAdvancedSearch(true);
                this.props.searchFormSetAdvancedSearchCriteria(criteria);
                this.handleAvailsAdvancedSearch(criteria);
            } else if (state.back) {
                gotoAvailsDashboard();
            }
        } else if (this.props.searchCriteria.availHistoryIds) {
            if (this.props.showSearchResults) {
                NexusBreadcrumb.push([AVAILS_HISTORY, AVAILS_SEARCH_RESULTS]);
            }
        } else {
            if(this.props.showSearchResults) {
                NexusBreadcrumb.push(AVAILS_SEARCH_RESULTS);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.searchCriteria !== this.props.searchCriteria) {
            NexusBreadcrumb.set(AVAILS_DASHBOARD);

            if (this.props.showSearchResults) {
                if(this.props.currentSearchCriteria.availHistoryIds && this.props.showAdvancedSearch){
                    NexusBreadcrumb.push(AVAILS_HISTORY);
                }
                NexusBreadcrumb.push(AVAILS_SEARCH_RESULTS);
            }
        }
    }

    toggleAdvancedSearch() {
        this.props.searchFormShowAdvancedSearch(!this.props.showAdvancedSearch);
    }

    handleAvailsFreeTextSearch(searchCriteria) {
        NexusBreadcrumb.set([AVAILS_DASHBOARD, AVAILS_SEARCH_RESULTS]);
        this.props.searchFormShowSearchResults(true);
        availSearchHelper.freeTextSearch(searchCriteria);
        this.cleanSelection();
    }

    handleAvailsAdvancedSearch(searchCriteria) {
        if (this.props.searchCriteria.availHistoryIds) {
            NexusBreadcrumb.set([AVAILS_DASHBOARD, AVAILS_HISTORY, AVAILS_SEARCH_RESULTS]);
        }else{
            NexusBreadcrumb.set([AVAILS_DASHBOARD, AVAILS_SEARCH_RESULTS]);
        }

        this.props.searchFormShowSearchResults(true);
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