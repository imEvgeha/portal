import './DashboardContainer.scss';

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

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
        dashboardSearchCriteria: state.dashboard.searchCriteria,
        useAdvancedSearch: state.dashboard.useAdvancedSearch,
        availTabPageSort: state.dashboard.availTabPageSort
    };
};

const mapDispatchToProps = {
    searchFormShowAdvancedSearch: searchFormUseAdvancedSearch,
    resultPageLoading,
    resultPageSort,
    resultPageUpdate
};

class DashboardContainer extends React.Component {
    static propTypes = {
        searchFormShowAdvancedSearch: t.func,
        resultPageLoading: t.func,
        resultPageSort: t.func,
        resultPageUpdate: t.func,
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
        searchFn(searchCriteria, 0, 20, this.defaultPageSort)
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
                <div className="container-fluid">
                    <div>
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        <FreeTextSearch disabled={this.state.showAdvancedSearch} containerId={'dashboard-avails'}
                                            onSearch={this.handleAvailsFreeTextSearch}/>
                                    </td>
                                    <td style={{width: '20px', paddingLeft: '8px'}}>
                                        <button className="btn btn-outline-secondary advanced-search-btn" title={'Advanced search'}
                                            id={'dashboard-avails-advanced-search-btn'} onClick={this.toggleAdvancedSearch}>
                                            <i className="fas fa-ellipsis-h" style={{fontSize: '1em'}}> </i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {this.state.showSearchResults && <a href={'#'} onClick={this.handleBackToDashboard}>Back to Dashboard</a>}
                </div>
                {this.state.showAdvancedSearch && <AdvancedSearchPanel onSearch={this.handleAvailsAdvancedSearch}/>}
                {!this.state.showSearchResults && <DashboardTab/>}
                {this.state.showSearchResults && <SearchResultsTab/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);