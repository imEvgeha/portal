import React from 'react';
import DashboardLatestAvailsCard from './card/DashboardLatestAvailsCard';
import DashboardCard from './card/components/DashboardCard';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import {Can} from '../../../../src/ability';
import './DashboardContainer.scss';

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
    };
};

class DashboardTab extends React.Component {

    static contextTypes = {
        router: t.object
    }

    createRight = () => {
        this.context.router.history.push('/avails/rights/create');
    };

    render() {
        return (
            <div className="dashboard-tab">
                <div className="row">
                    {/*<DashboardCard title="Manage Avails Errors" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-exclamation-triangle'}/>*/}
                    <Can I="create" a="Avail">
                        <DashboardCard title="Create New Edit Version" action={this.createRight} actionName="Create" iconClass="fas fa-file-alt" name="create-right" />
                    </Can>
                    {/*<DashboardCard title="Avails Calendar" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-calendar-alt'}/>*/}
                    {<DashboardLatestAvailsCard push={this.context.router.history.push} />}
                </div>
                <div className="row" />
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(DashboardTab);