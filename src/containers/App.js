import React from 'react';

import {
    BrowserRouter as Router,
    Redirect,
    Route
} from 'react-router-dom';
import Navbar from './Navbar';
import DashboardContainer from './dashboard/DashboardContainer';
import AvailIngestHistoryContainer from './avail-ingest-history/AvailIngestHistoryContainer';
import DashboardContainer2 from './metadata/dashboard/DashboardContainer';

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <div>
                    <Navbar/>
                    <div >
                        <Route exact path="/" render={() => <Redirect to="/dashboard"/> }/>
                        <Route path="/dashboard" component={DashboardContainer}/>
                        <Route path="/avail-ingest-history" component={AvailIngestHistoryContainer}/>
                        <Route path="/metadata" component={DashboardContainer2} />
                    </div>
                </div>
            </Router>
        );
    }
}
