import './DashboardContainer.scss'

import React from 'react'
import {connect} from "react-redux";

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
                <br/>
                <h2 >Dashboard</h2>
                <p>Content</p>
            </div>
        );
    }
}

export default connect(mapState, mapActions)(DashboardContainer)