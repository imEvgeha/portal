import './DashboardContainer.scss'

import React from 'react'
import {connect} from "react-redux";
import AvailsResultTable from "./components/AvailsResultTable";
import {availDetailsModal} from "./components/AvailDetailsModal";

const mapState = state => {
    return {
    };
};

const mapActions = {
};

class SearchResultsTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.showDetails = this.showDetails.bind(this);
    }

    showDetails() {
        availDetailsModal.open({id:5, title: 'Batman', studio: 'Disney'}, () => {
        })
    }

    render() {
        return (
            <div>
                <button className="btn btn-primary" onClick={this.showDetails}>Open</button>
                <AvailsResultTable/>
            </div>
        );
    }
}

export default connect(mapState, mapActions)(SearchResultsTab)