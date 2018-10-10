import './DashboardContainer.scss'

import React from 'react'
import {connect} from "react-redux";
import FreeTextSearch from "../../components/FreeTextSearch";
import AvailsResultTable from "./components/AvailsResultTable";
import AdvancedSearchPanel from "./components/AdvancedSearchPanel";
import {dashboardUpdateSearchForm} from "../../actions";
import DashboardDropableCard from "./components/DashboardDropableCard";
import DashboardCard from "./components/DashboardCard";
import DashboardTab from "./DashboardTab";

const mapState = state => {
    return {
        profileInfo: state.profileInfo,
        dashboardSearchCriteria: state.dashboardSearchCriteria
    };
};

const mapActions = {
    dashboardUpdateSearchForm
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

    handleAvailsSerach() {
        this.setState({showSearchResults: true});
    }

    handleBackToDashboard() {
        this.setState({showSearchResults: false, showAdvancedSearch: false});
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
                { this.state.showSearchResults && <AvailsResultTable/> }
            </div>
        );
    }
}

export default connect(mapState, mapActions)(DashboardContainer)