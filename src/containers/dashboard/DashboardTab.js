import './DashboardContainer.scss';

import React from 'react';
import DashboardDropableCard from './components/DashboardDropableCard';
import DashboardLatestAvailsCard from './components/DashboardLatestAvailsCard';
import DashboardCard from './components/DashboardCard';
import {availCreateModal} from './components/AvailCreateModal';
import {resultPageLoading, resultPageSort, resultPageUpdate, searchFormUseAdvancedSearch} from '../../actions/dashboard';
import {loadAvailsMapping} from '../../actions';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
        availsMapping: state.root.availsMapping,
    };
};

const mapDispatchToProps = {
    searchFormShowAdvancedSearch: searchFormUseAdvancedSearch,
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    loadAvailsMapping
};

class DashboardTab extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        searchFormShowAdvancedSearch: t.func,
        resultPageLoading: t.func,
        resultPageSort: t.func,
        resultPageUpdate: t.func,
        loadAvailsMapping: t.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            ingestedCount: '-'
        };

    }

    createAvail = () => {
        availCreateModal.open(() => {}, () => {}, {availsMapping: this.props.availsMapping});
    };

    render() {
        return (
            <div className={'dashboard-tab'}>
                <div className="row">
                    <DashboardDropableCard/>
                    {/*<DashboardCard title="Manage Avails Errors" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-exclamation-triangle'}/>*/}
                    <DashboardCard title="Create New Edit Version" action={this.createAvail} actionName={'Create'} iconClass={'fas fa-file-alt'} name={'create-avails'}/>
                    {/*<DashboardCard title="Avails Calendar" action={this.viewErrors} actionName={'View'} iconClass={'fas fa-calendar-alt'}/>*/}
                    {<DashboardLatestAvailsCard/>}
                </div>
                <div className="row">

                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardTab);