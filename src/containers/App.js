import React from 'react';

import {
    BrowserRouter as Router,
    Redirect,
    Route
} from 'react-router-dom';
import Navbar from './Navbar';
import DashboardContainer from './dashboard/DashboardContainer';
import AvailIngestHistoryContainer from './avail-ingest-history/AvailIngestHistoryContainer';
import {Can} from '../ability';

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <div>
                    <Navbar/>
                    <div >
                        <Route exact path="/" render={() => <Redirect to="/dashboard"/> }/>
                        <Can I="read" a="Avail">
                            <Route path="/dashboard" component={DashboardContainer}/>
                        </Can>
                        <Can I="read" a="Avail">
                            <Route path="/avail-ingest-history" component={AvailIngestHistoryContainer}/>
                        </Can>
                    </div>
                </div>
            </Router>
        );
    }
}
