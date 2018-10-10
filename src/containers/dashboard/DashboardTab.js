import './DashboardContainer.scss'

import React from 'react'
import {connect} from "react-redux";
import DashboardDropableCard from "./components/DashboardDropableCard";
import DashboardCard from "./components/DashboardCard";
import {dashboardService} from "./DashboardService";

const mapState = state => {
    return {
    };
};

const mapActions = {
};

class DashboardTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ingestedCount: '-'
        };
        this.viewErrors = this.viewErrors.bind(this);

    }

    viewErrors() {
        console.log("Error ")
    }

    componentWillMount() {
        dashboardService.ingestedAvailsCount().then( (res) => {
            console.log(res);
            this.setState({ingestedCount: res.data.total})
        });
    }

    render() {
        return (
            <div className={'dashboard-tab'}>
                <div className="row">
                    <DashboardDropableCard/>
                    <DashboardCard title="Manage Avails Errors" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-exclamation-triangle'}/>
                    <DashboardCard title="Create New Edit Version" action={this.viewErrors} actionName={'Create'} iconClass={'fas fa-file-alt'}/>
                    <DashboardCard title="Avails Calendar" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-calendar-alt'}/>
                    <DashboardCard title={"Ingested Avails: " + this.state.ingestedCount} iconClass={'fas fa-check-circle'}/>
                </div>
                <div className="row">

                </div>
            </div>
        );
    }
}

export default connect(mapState, mapActions)(DashboardTab)