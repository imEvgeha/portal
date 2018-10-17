import './DashboardContainer.scss'

import React from 'react'
import {connect} from "react-redux";
import FreeTextSearch from "../../components/FreeTextSearch";
import AdvancedSearchPanel from "./components/AdvancedSearchPanel";
import {
    dashboardResultPageUpdate,
    dashboardUpdateSearchForm,
    dashboardResultPageLoading,
    dashboardResultPageSort
} from "../../actions";
import DashboardTab from "./DashboardTab";
import SearchResultsTab from "./SearchResultsTab";
import {dashboardService} from "./DashboardService";

const mapState = state => {
    return {
        profileInfo: state.profileInfo,
        dashboardSearchCriteria: state.dashboardSearchCriteria,
        dashboardAvailTabPageSort: state.dashboardAvailTabPageSort
    };
};

const mapActions = {
    dashboardUpdateSearchForm,
    dashboardResultPageUpdate,
    dashboardResultPageLoading,
    dashboardResultPageSort
};

class DashboardContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showAdvancedSearch: false,
            showSearchResults: false
        };
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
        this.handleAvailsSerach = this.handleAvailsSerach.bind(this);
        this.handleBackToDashboard = this.handleBackToDashboard.bind(this);
    }

    toggleAdvancedSearch() {
        this.setState({showAdvancedSearch: !this.state.showAdvancedSearch})
    }

    handleAvailsSerach(searchCriteria) {
        this.availSearch(searchCriteria);
        this.setState({showSearchResults: true});
    }

    handleBackToDashboard() {
        this.setState({showSearchResults: false, showAdvancedSearch: false});
    }

    availSearch(searchCriteria) {
        this.props.dashboardResultPageLoading(true);
        this.props.dashboardResultPageSort([]);
        dashboardService.getAvails(searchCriteria ,0, 20, this.props.dashboardAvailTabPageSort)
        .then(response => {
                this.props.dashboardResultPageUpdate({
                    pages: 1,
                    avails: response.data.data,
                    pageSize: response.data.data.length,
                    total: response.data.total
                });
            this.props.dashboardResultPageLoading(false);
            }
        ).catch((error) => {
            this.props.dashboardResultPageLoading(false);
            console.log("Unexpected error");
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
                                        <FreeTextSearch containerId={'dashboard-avails'} onSearch={this.handleAvailsSerach}/>
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
                { this.state.showAdvancedSearch && <AdvancedSearchPanel onSearch={this.handleAvailsSerach}/>}
                { !this.state.showSearchResults && <DashboardTab/> }
                { this.state.showSearchResults && <SearchResultsTab/> }
            </div>
        );
    }
}

export default connect(mapState, mapActions)(DashboardContainer)