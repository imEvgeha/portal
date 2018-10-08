import './DashboardContainer.scss'

import React from 'react'
import {connect} from "react-redux";
import FreeTextSearch from "../../components/FreeTextSearch";
import AvailsResultTable from "./components/AvailsResultTable";
import AdvancedSearchPanel from "./components/AdvancedSearchPanel";
import {dashboardUpdateSearchForm} from "../../actions";
import DashboardDropableCard from "./components/DashboardDropableCard";
import DashboardCard from "./components/DashboardCard";

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
            showAdvancedSearch: false
        };
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
    }

    toggleAdvancedSearch() {
        this.setState({showAdvancedSearch: !this.state.showAdvancedSearch})
    }

    viewErrors() {
        console.log("Error ")
    }

    render() {
        return (
            <div>
                <div className="search-bar container-fluid">
                    <div className="row">
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        <FreeTextSearch containerId={'dashboard-avails'}/>
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
                    <br/>
                    { this.state.showAdvancedSearch && <AdvancedSearchPanel/>}
                    <div className="row">
                        <DashboardDropableCard/>
                        <DashboardCard title="ManageAvailsErrors" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-exclamation-triangle'}/>
                        <DashboardCard title="Create New Edit Version" action={this.viewErrors} actionName={'Create'} iconClass={'fas fa-file-alt'}/>
                    </div>
                </div>

                <AvailsResultTable/>
            </div>
        );
    }
}

export default connect(mapState, mapActions)(DashboardContainer)