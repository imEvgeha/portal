import React from 'react';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import {IfEmbedded} from './../util/Common';
import Navbar from './Navbar';
import RightDashboardContainer  from './avail/dashboard/DashboardContainer';
import RightDetails  from './avail/details/RightDetails';
import RightCreate  from './avail/create/RightCreate';
import AvailIngestHistoryContainer from './avail/ingest-history/AvailIngestHistoryContainer';
import MetadataDashboardContainer from './metadata/dashboard/DashboardContainer';
import {canRender} from '../ability';
import Welcome from './Welcome';
import NexusBreadcrumb from './NexusBreadcrumb';
import TitleEdit from './metadata/dashboard/components/TitleEdit';

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <IfEmbedded value={false}>
                        <Navbar/>
                    </IfEmbedded>
                    <NexusBreadcrumb/>
                    <div>
                        <Route exact path="/" component={Welcome}/>
                        <Switch>
                            <Route exact path="/avails" component={canRender(RightDashboardContainer, 'read', 'Avail')}/>
                            <Route exact path="/avails/rights" component={canRender(RightDashboardContainer, 'read', 'Avail')}/>
                            <Route exact path="/avails/rights/create" component={canRender(RightCreate, 'create', 'Avail')}/>
                            <Route exact path="/avails/rights/select_available" component={canRender(UnderConstruction, 'create', 'Avail')}/>
                            <Route exact path="/avails/rights/:id" component={canRender(RightDetails, 'read', 'Avail')}/>
                            <Route exact path="/avails/rights/:id/match" component={canRender(UnderConstruction, 'read', 'Avail')}/>
                            <Route exact path="/avails/history" component={canRender(AvailIngestHistoryContainer, 'read', 'Avail')}/>
                            <Route exact path="/avails/history/:availHistoryIds" component={canRender(RightDashboardContainer, 'read', 'Avail')}/>
                            <Route exact path="/avails/history/:availHistoryIds/create_from_attachments" component={canRender(UnderConstruction, 'read', 'Avail')}/>
                            <Route exact path="/avails/history/:availHistoryIds/:valid" component={canRender(RightDashboardContainer, 'read', 'Avail')}/>
                        </Switch>
                        <Route exact path="/metadata" component={MetadataDashboardContainer} />
                        <Route exact path="/metadata/detail/:id" component={TitleEdit} />
                    </div>
                </div>
            </Router>
        );
    }
}

import {Component} from 'react';
import t from 'prop-types';
class UnderConstruction extends Component {
    static propTypes = {
        match: t.object
    }
    render(){
        return(
            <div>
                <div> UNDER CONSTRUCTION </div>
                {this.props.match.path}
            </div>
        );
    }
}


