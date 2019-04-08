import './DashboardContainer.scss';

import React from 'react';
import {connect} from 'react-redux';
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
    resultPageShowSelected
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

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
        availsMapping: state.root.availsMapping,
        selectValues: state.root.selectValues,
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
    searchFormUpdateAdvancedSearchCriteria
};

class DashboardContainer extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        selectValues: t.object,
        searchCriteria: t.any,
        currentSearchCriteria: t.any,
        resultPageLoading: t.func,
        resultPageSort: t.func,
        resultPageUpdate: t.func,
        searchFormShowAdvancedSearch: t.func,
        searchFormShowSearchResults: t.func,
        searchFormSetAdvancedSearchCriteria: t.func,
        searchFormUpdateAdvancedSearchCriteria: t.func,
        selected: t.array,
        showAdvancedSearch: t.bool,
        showSearchResults: t.bool,
        location: t.object,
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

        if(this.props.availsMapping){
            this.getSearchCriteriaFromURL();
        }

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
        if(prevProps.availsMapping !== this.props.availsMapping){
            this.getSearchCriteriaFromURL();
        }

        if(prevProps.selectValues !== this.props.selectValues){
            if(this.props.availsMapping) {
                this.getSearchCriteriaFromURL();
            }
        }

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

    getSearchCriteriaFromURL(){
        let params=null;
        if(this.props.location && this.props.location.search){
            params = this.props.location.search.substr(1).split('&');
            if(params.length === 0) return 0;
        }else{
            return 0;
        }

        const criteria = {};
        let found = -1;

        params.forEach(param => {
            const vals = param.split('=');
            if(vals.length === 2){
                let name = vals[0];
                const val = vals[1];
                let subkey = null;
                let map = this.props.availsMapping.mappings.find(({queryParamName}) => queryParamName === name);
                if(!map && name.endsWith('From')){
                    subkey = 'from';
                    name = name.substring(0, name.length - 4);
                }
                if(!map && name.endsWith('To')){
                    subkey = 'to';
                    name = name.substring(0, name.length - 2);
                }
                if(subkey) {
                    map = this.props.availsMapping.mappings.find(({queryParamName}) => queryParamName === name);
                    if (map && ['date', 'localdate', 'duration'].indexOf(map.dataType) === -1) map = null;
                }
                if(map){
                    if(!criteria[name]) found++;
                    if(!subkey){
                        if(map.searchDataType === 'multiselect' || map.searchDataType === 'multilanguage'){
                            let vals = val.split(',');
                            let allOptions = this.props.selectValues[map.javaVariableName];
                            if(allOptions) {
                                allOptions.map((rec) => rec.label = rec.value);
                                vals = vals.map((opt) => allOptions.find((rec) => rec.value === opt)).filter((v) => v);
                                if(vals.length > 0) {
                                    criteria[name] = {name: name, order: found, options: vals};
                                }
                            }
                        }else {
                            criteria[name] = {name: name, order: found, value: val};
                        }
                    }else{
                        criteria[name] = criteria[name] || {name: name, order: found};
                        criteria[name][subkey] = val;
                    }
                }
            }
        });

        if(found) {
            this.props.searchFormUpdateAdvancedSearchCriteria(criteria);
            this.handleAvailsAdvancedSearch(criteria);
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