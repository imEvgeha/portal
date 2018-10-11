import './DashboardContainer.scss'

import React from 'react'
import {connect} from "react-redux";
import AvailsResultTable from "./components/AvailsResultTable";

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
    }

    render() {
        return (
            <div>
                <AvailsResultTable/>
            </div>
        );
    }
}

export default connect(mapState, mapActions)(SearchResultsTab)