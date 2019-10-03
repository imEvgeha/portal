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
import RightDetailsv2 from './avail/details/RightDetailsv2';
import RightCreatev2 from './avail/create/RightCreatev2';
import RightsCreateFromAttachment  from './avail/create/RightsCreateFromAttachment';
import SelectRightsPlanning  from './avail/DOP/SelectRightsPlanning';
import FixRights from './avail/DOP/FixRights';
import AvailIngestHistoryContainer from './avail/ingest-history/AvailIngestHistoryContainer';
import MetadataDashboardContainer from './metadata/dashboard/DashboardContainer';
import {canRender} from '../ability';
import Welcome from './Welcome';
import NexusBreadcrumb from './NexusBreadcrumb';
import TitleEdit from './metadata/dashboard/components/TitleEdit';
import DOP from '../util/DOP';

import ContractProfile from './contracts/profile/ContractProfile.jsx';
import Contract from './contracts/search/Contract.jsx';

import Media from './media/search/Media.js';
import Settings from './settings/Settings';

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="component-container">
                    <IfEmbedded>
                        <DOP/>
                    </IfEmbedded>
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
                            <Route exact path="/avails/rights/:id/match" component={canRender(UnderConstruction, 'read', 'Avail')}/>
                            <Route exact path="/avails/rights/:id" component={canRender(RightDetails, 'read', 'Avail')}/>
                            <Route exact path="/avails/history/create_from_attachments" component={canRender(RightsCreateFromAttachment, 'create', 'Avail')}/>
                            <Route exact path="/avails/history/fix-errors" component={canRender(FixRights, 'update', 'Avail')}/>
                            <Route exact path="/avails/history/:availHistoryIds/fix-errors" component={canRender(FixRights, 'update', 'Avail')}/>
                            <Route exact path="/avails/history/:availHistoryIds/:valid(errors)" component={canRender(RightDashboardContainer, 'read', 'Avail')}/>
                            <Route exact path="/avails/history/:availHistoryIds/create_from_attachments" component={canRender(RightsCreateFromAttachment, 'create', 'Avail')}/>
                            <Route exact path="/avails/history/:availHistoryId/rights/create" component={canRender(RightCreate, 'create', 'Avail')}/>
                            <Route exact path="/avails/history/:availHistoryIds" component={canRender(RightDashboardContainer, 'read', 'Avail')}/>
                            <Route exact path="/avails/history" component={canRender(AvailIngestHistoryContainer, 'read', 'Avail')}/>
                            <Route exact path="/avails/select_rights_planning" component={canRender(SelectRightsPlanning, 'update', 'Avail')}/>

                            <Route exact path="/avails/rights/create/v2" component={canRender(RightCreatev2, 'create', 'Avail')}/>
                            <Route exact path="/avails/rights/:id/v2" component={canRender(RightDetailsv2, 'read', 'Avail')}/>
                        </Switch>
                        <Route exact path="/metadata" component={canRender(MetadataDashboardContainer, 'read', 'Metadata')} />
                        <Route exact path="/metadata/detail/:id" component={canRender(TitleEdit, 'read', 'Metadata')} />

                        <Route exact path="/contractprofile" component={ContractProfile} />
                        <Route exact path="/contractsearch" component={Contract} />

                        <Route exact path="/Media" component={canRender(Media, 'read', 'AssetManagement')} />
                        <Route exact path="/settings" component={Settings} />

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


