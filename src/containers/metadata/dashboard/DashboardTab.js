import './DashboardContainer.scss';

import React from 'react';
import DashboardCard from '../../metadata/dashboard/components/DashboardCard';



class DashboardTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ingestedCount: '-',
            modalBox: null
        };

    }

    render() {
        return (
            <div className={'dashboard-tab'}>
                <div className="row">
                    {/*<DashboardCard title="Manage Title Errors" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-exclamation-triangle'}/>*/}
                    <DashboardCard title="Create New Title" action={this.state.modalBox} actionName={'Create'} iconClass={'fas fa-file-alt'} name={'create-title'}/>
                    {/*<DashboardCard title="Title Calendar" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-calendar-alt'}/>*/}
                </div>
                <div className="row">

                </div>
            </div>
        );
    }
}

export default DashboardTab;