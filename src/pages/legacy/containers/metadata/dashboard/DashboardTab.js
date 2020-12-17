import './DashboardContainer.scss';

import React from 'react';
import DashboardCard from '../../metadata/dashboard/components/DashboardCard';
import {Can} from '@vubiquity-nexus/portal-utils/lib/ability';

class DashboardTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalBox: null,
        };
    }

    render() {
        return (
            <div className="dashboard-tab">
                <div className="row">
                    {/*<DashboardCard title="Manage Title Errors" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-exclamation-triangle'}/>*/}
                    <Can I="create" a="Metadata">
                        <DashboardCard
                            title="Create New Title"
                            action={this.state.modalBox}
                            actionName="Create"
                            iconClass="fas fa-file-alt"
                            name="create-title"
                        />
                    </Can>
                    {/*<DashboardCard title="Title Calendar" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-calendar-alt'}/>*/}
                </div>
                <div className="row" />
            </div>
        );
    }
}

export default DashboardTab;
