import './DashboardContainer.scss'

import React from 'react'
import {connect} from "react-redux";
import FreeTextSearch from "../../components/FreeTextSearch";

const mapState = state => {
    return {
        profileInfo: state.profileInfo,
    };
};

const mapActions = {};

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
                        </table>
                    </div>
                </div>
                <br/>
                <h2>Dashboard</h2>
                <p>Content</p>
            </div>
        );
    }
}

export default connect(mapState, mapActions)(DashboardContainer)