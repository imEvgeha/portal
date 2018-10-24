import './DashboardContainer.scss';

import React from 'react';
import DashboardDropableCard from './components/DashboardDropableCard';
import DashboardCard from './components/DashboardCard';
import {dashboardService} from './DashboardService';
import {availCreateModal} from './components/AvailCreateModal';

export default class DashboardTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ingestedCount: '-'
        };
        this.viewErrors = this.viewErrors.bind(this);

    }

    viewErrors() {
        console.log('Error ');
    }

    componentDidMount() {
        dashboardService.ingestedAvailsCount().then((res) => {
            console.log(res);
            this.setState({ingestedCount: res.data.total});
        });
    }

    createAvail = () => {
        availCreateModal.open(() => {}, () => {});
    };

    render() {
        return (
            <div className={'dashboard-tab'}>
                <div className="row">
                    <DashboardDropableCard/>
                    <DashboardCard title="Manage Avails Errors" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-exclamation-triangle'}/>
                    <DashboardCard title="Create New Edit Version" action={this.createAvail} actionName={'Create'} iconClass={'fas fa-file-alt'}/>
                    <DashboardCard title="Avails Calendar" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-calendar-alt'}/>
                </div>
                <div className="row">

                </div>
            </div>
        );
    }
}