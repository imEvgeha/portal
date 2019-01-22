import React from 'react';

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import Navbar from './Navbar';
import DashboardContainer from './dashboard/DashboardContainer';
import AvailIngestHistoryContainer from './avail-ingest-history/AvailIngestHistoryContainer';
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
                        <Route path="/dashboard" component={canRender(DashboardContainer, 'read', 'Avail')}/>
                        <Route path="/avail-ingest-history" component={canRender(AvailIngestHistoryContainer, 'read', 'Avail')}/>
                    </div>
                </div>
            </Router>
        );
    }
}
