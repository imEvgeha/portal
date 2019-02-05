import React from 'react';

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import Navbar from './Navbar';
import AvailDashboardContainer  from './avail/dashboard/DashboardContainer';
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
                    <Navbar/>
                    <NexusBreadcrumb/>
                    <div>
                        <Route exact path="/" component={Welcome}/>
                        <Route exact path="/avails" component={canRender(AvailDashboardContainer, 'read', 'Avail')}/>
                        <Route path="/avails/history" component={canRender(AvailIngestHistoryContainer, 'read', 'Avail')}/>
                        <Route exact path="/metadata" component={MetadataDashboardContainer} />
                        <Route exact path="/metadata/detail/:id" component={TitleEdit} />
                    </div>
                </div>

            </Router>
        );
    }
}
