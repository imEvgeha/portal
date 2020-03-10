import React from 'react';
import DashboardLatestAvailsCard from './card/DashboardLatestAvailsCard';
import DashboardCard from './card/components/DashboardCard';
import {resultPageLoading, resultPageSort, resultPageUpdate} from '../../../stores/actions/avail/dashboard';
import {connect} from 'react-redux';
import t from 'prop-types';
import {Can} from '../../../../src/ability';
import './DashboardContainer.scss';

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
        availsMapping: state.root.availsMapping,
    };
};

const mapDispatchToProps = {
    resultPageLoading,
    resultPageSort,
    resultPageUpdate
};

class DashboardTab extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        resultPageLoading: t.func,
        resultPageSort: t.func,
        resultPageUpdate: t.func
    };

    static contextTypes = {
        router: t.object
    }

    constructor(props) {
        super(props);

        this.state = {
            ingestedCount: '-'
        };

    }

    createRight = () => {
        this.context.router.history.push('/avails/rights/create');
    };

    render() {
        return (
            <div className={'dashboard-tab'}>
                <div className="row">
                    {/*<DashboardCard title="Manage Avails Errors" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-exclamation-triangle'}/>*/}
                    <Can I="create" a="Avail">
                        <DashboardCard title="Create New Edit Version" action={this.createRight} actionName={'Create'} iconClass={'fas fa-file-alt'} name={'create-right'}/>
                    </Can>
                    {/*<DashboardCard title="Avails Calendar" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-calendar-alt'}/>*/}
                    {<DashboardLatestAvailsCard push={this.context.router.history.push}/>}
                </div>
                <div className="row">

                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardTab);