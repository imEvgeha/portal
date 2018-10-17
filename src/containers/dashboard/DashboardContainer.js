import './DashboardContainer.scss'

import React from 'react'
import {connect} from "react-redux";
import FreeTextSearch from "./components/FreeTextSearch";
import AdvancedSearchPanel from "./components/AdvancedSearchPanel";
import {
    dashboardResultPageUpdate,
    dashboardResultPageLoading
} from "../../actions/index";
import {
    searchFormShowAdvancedSearch
} from "../../actions/dashboard"
import DashboardTab from "./DashboardTab";
import SearchResultsTab from "./SearchResultsTab";
import {dashboardService} from "./DashboardService";

const mapState = state => {
    return {
        profileInfo: state.profileInfo,
        dashboardSearchCriteria: state.dashboard.searchCriteria,
        useAdvancedSearch: state.dashboard.useAdvancedSearch,
        dashboardAvailTabPageSort: state.dashboardAvailTabPageSort
    };
};

const mapActions = {
    dashboardResultPageUpdate,
    dashboardResultPageLoading,
    searchFormShowAdvancedSearch,
};

class DashboardContainer extends React.Component {

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

    toggleAdvancedSearch() {
        this.props.searchFormShowAdvancedSearch(!this.props.useAdvancedSearch);
    }

    handleAvailsFreeTextSearch(searchCriteria) {
        this.props.dashboardResultPageLoading(true);
        dashboardService.freeTextSearch(searchCriteria ,0, 20, this.props.dashboardAvailTabPageSort)
        .then(response => {
                this.processResponse(response);
                this.props.dashboardResultPageLoading(false);
            }
        ).catch((error) => {
            this.props.dashboardResultPageLoading(false);
            console.log("Unexpected error");
        });
        this.setState({showSearchResults: true});
    }

    handleAvailsAdvancedSearch(searchCriteria) {
        this.props.dashboardResultPageLoading(true);
        dashboardService.advancedSearch(searchCriteria ,0, 20, this.props.dashboardAvailTabPageSort)
        .then(response => {
                this.processResponse(response);
                this.props.dashboardResultPageLoading(false);
            }
        ).catch((error) => {
            this.props.dashboardResultPageLoading(false);
            console.log("Unexpected error");
        });
        this.setState({showSearchResults: true});
    }

    handleBackToDashboard() {
        this.setState({showSearchResults: false, showAdvancedSearch: false});
    }

    processResponse(response) {
        this.props.dashboardResultPageUpdate({
            pages: 1,
            avails: response.data.data,
            pageSize: response.data.data.length,
            total: response.data.total
        });
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div >
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        <FreeTextSearch containerId={'dashboard-avails'} onSearch={this.handleAvailsFreeTextSearch}/>
                                    </td>
                                    <td style={{width: "20px"}}>
                                        <button className="btn btn-outline-secondary advanced-search-btn" title={"Advanced search"} id={"dashboard-avails-advanced-search-btn"} onClick={this.toggleAdvancedSearch}>
                                            <i className="fas fa-ellipsis-h" style={{fontSize: "1em"}}> </i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    { this.state.showSearchResults && <a href={'#'} onClick={this.handleBackToDashboard}>Back to Dashboard</a> }
                </div>
                { this.props.useAdvancedSearch && <AdvancedSearchPanel onSearch={this.handleAvailsAdvancedSearch}/>}
                { !this.state.showSearchResults && <DashboardTab/> }
                { this.state.showSearchResults && <SearchResultsTab/> }
            </div>
        );
    }
}

export default connect(mapState, mapActions)(DashboardContainer)