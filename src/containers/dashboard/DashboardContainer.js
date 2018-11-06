import './DashboardContainer.scss';

import config from 'react-global-configuration';
import React from 'react';
import {connect} from 'react-redux';
import FreeTextSearch from './components/FreeTextSearch';
import AdvancedSearchPanel from './components/AdvancedSearchPanel';
import {
    searchFormUseAdvancedSearch,
    resultPageLoading,
    resultPageSort,
    resultPageUpdate
} from '../../actions/dashboard';
import DashboardTab from './DashboardTab';
import SearchResultsTab from './SearchResultsTab';
import {dashboardService} from './DashboardService';
import t from 'prop-types';
import {loadAvailsMapping} from '../../actions';
import {profileService} from './ProfileService';

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
    loadAvailsMapping
};

class DashboardContainer extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        searchFormShowAdvancedSearch: t.func,
        resultPageLoading: t.func,
        resultPageSort: t.func,
        resultPageUpdate: t.func,
        loadAvailsMapping: t.func,
    };

    defaultPageSort = [];

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
    }

    componentDidMount() {
        if (!this.props.availsMapping) {
            profileService.getAvailsMapping().then( (response) => {
                this.props.loadAvailsMapping(response.data);
            }). catch((error) => {
               console.error('Unable to load AvailsMapping');
               console.error(error);
            });
        }
    }

    handleBackToDashboard() {
        this.setState({showSearchResults: false, showAdvancedSearch: false});
    }

    toggleAdvancedSearch() {
        this.setState({showAdvancedSearch: !this.state.showAdvancedSearch});
    }

    handleAvailsFreeTextSearch(searchCriteria) {
        this.props.searchFormShowAdvancedSearch(false);
        this.doSearch(searchCriteria, dashboardService.freeTextSearch);
    }

    handleAvailsAdvancedSearch(searchCriteria) {
        this.props.searchFormShowAdvancedSearch(true);
        this.doSearch(searchCriteria, dashboardService.advancedSearch);
    }

    doSearch(searchCriteria, searchFn) {
        this.props.resultPageLoading(true);
        this.props.resultPageSort(this.defaultPageSort);
        searchFn(searchCriteria, 0, config.get('avails.page.size'), this.defaultPageSort)
            .then(response => {
                this.props.resultPageLoading(false);
                this.props.resultPageUpdate({
                    pages: 1,
                    avails: response.data.data,
                    pageSize: response.data.data.length,
                    total: response.data.total
                });
            }
            ).catch(() => {
                this.props.resultPageLoading(false);
                console.log('Unexpected error');
            });
        this.setState({showSearchResults: true});
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