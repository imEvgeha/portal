import React from 'react';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import {getUrlParamIfExists} from './../util/Common';
import Navbar from './Navbar';
import AvailDashboardContainer  from './avail/dashboard/DashboardContainer';
import AvailDetails  from './avail/details/RightDetails';
import AvailCreate  from './avail/create/RightCreate';
import AvailIngestHistoryContainer from './avail/ingest-history/AvailIngestHistoryContainer';
import MetadataDashboardContainer from './metadata/dashboard/DashboardContainer';
import {canRender} from '../ability';
import Welcome from './Welcome';
import NexusBreadcrumb from './NexusBreadcrumb';
import TitleEdit from './metadata/dashboard/components/TitleEdit';

export default class App extends React.Component {

    render() {
        let embedded = getUrlParamIfExists('embedded', false) === 'true';

        return (
            <Router>
                <div>
                    {!embedded &&
                        <Navbar/>
                    }
                    <NexusBreadcrumb/>
                    <div>
                        <Route exact path="/" component={Welcome}/>
                        <Route exact path="/avails" component={canRender(AvailDashboardContainer, 'read', 'Avail')}/>
                        <Switch>
                            <Route exact path="/avails/history" component={canRender(AvailIngestHistoryContainer, 'read', 'Avail')}/>
                            <Route exact path="/avails/create" component={canRender(AvailCreate, 'create', 'Avail')}/>
                            <Route exact path="/avails/:id" component={canRender(AvailDetails, 'read', 'Avail')}/>
                        </Switch>
                        <Route exact path="/metadata" component={MetadataDashboardContainer} />
                        <Route exact path="/metadata/detail/:id" component={TitleEdit} />
                    </div>
                </div>

            </Router>
        );
    }
}
