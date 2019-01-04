import React from 'react';

import {
    BrowserRouter as Router,
    Redirect,
    Route
} from 'react-router-dom';
import Navbar from './Navbar';
import DashboardContainer from './dashboard/DashboardContainer';
import AvailIngestHistoryContainer from './avail-ingest-history/AvailIngestHistoryContainer';

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
                    </div>
                </div>
            </Router>
        );
    }
}
