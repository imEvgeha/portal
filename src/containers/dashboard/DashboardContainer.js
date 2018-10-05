import './DashboardContainer.scss'

import React from 'react'
import {connect} from "react-redux";
import FreeTextSearch from "../../components/FreeTextSearch";
import AvailsResultTable from "./components/AvailsResultTable";
import AdvancedSearchPanel from "./components/AdvancedSearchPanel";
import {dashboardUpdateSearchForm} from "../../actions";

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
                                        <button className="btn btn-outline-secondary" style={{borderRadius: "40px"}} title={"Advanced search"} id={"dashboard-avails-advanced-search-btn"}>
                                            <i className="fas fa-ellipsis-h" style={{fontSize: "1em"}}></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br/>
                <AdvancedSearchPanel/>
                <AvailsResultTable/>
            </div>
        );
    }
}

export default connect(mapState, mapActions)(DashboardContainer)