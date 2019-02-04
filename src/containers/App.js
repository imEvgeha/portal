import React from 'react';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import Navbar from './Navbar';
import AvailDashboardContainer  from './avail/dashboard/DashboardContainer';
import AvailDetails  from './avail/details/AvailDetails';
import AvailCreate  from './avail/create/AvailCreate';
import AvailIngestHistoryContainer from './avail/ingest-history/AvailIngestHistoryContainer';
import MetadataDashboardContainer from './metadata/dashboard/DashboardContainer';
import {canRender} from '../ability';
import Welcome from './Welcome';
import NexusBreadcrumb from './NexusBreadcrumb';

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <div>
                    <Navbar/>
                    <NexusBreadcrumb/>
                    <div >
                        <Route exact path="/" component={Welcome}/>
                        <Route exact path="/avails" component={canRender(AvailDashboardContainer, 'read', 'Avail')}/>
                        <Switch>
                            <Route exact path="/avails/history" component={canRender(AvailIngestHistoryContainer, 'read', 'Avail')}/>
                            <Route exact path="/avails/new" component={AvailCreate}/>
                            <Route exact path="/avails/:id" component={AvailDetails}/>
                        </Switch>
                        <Route path="/metadata" component={MetadataDashboardContainer} />
                    </div>
                </div>

            </Router>
        );
    }
}
