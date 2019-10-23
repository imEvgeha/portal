import React from 'react';
import {Route, Switch} from 'react-router-dom';
import RightDashboardContainer  from './containers/avail/dashboard/DashboardContainer';
import RightDetails  from './containers/avail/details/RightDetails';
import RightCreate  from './containers/avail/create/RightCreate';
import RightCreateV2  from './containers/avail/create/RightCreateV2';
import RightsCreateFromAttachment  from './containers/avail/create/RightsCreateFromAttachment';
import SelectRightsPlanning  from './containers/avail/DOP/SelectRightsPlanning';
import FixRights from './containers/avail/DOP/FixRights';
import AvailIngestHistoryContainer from './containers/avail/ingest-history/AvailIngestHistoryContainer';
import MetadataDashboardContainer from './containers/metadata/dashboard/DashboardContainer';
import {canRender} from './ability';
import Welcome from './containers/Welcome';
import TitleEdit from './containers/metadata/dashboard/components/TitleEdit';
import ContractProfile from './containers/contracts/profile/ContractProfile.jsx';
import Contract from './containers/contracts/search/Contract.jsx';
import Media from './containers/media/search/Media.js';
import Settings from './containers/settings/Settings';
import RightMatchingView from './avails/right-matching/RightMatchingView';
import NotFound from './static-page-view/NotFound';
import RightToMatchView from './avails/right-matching/right-to-match/RightToMatchView';
import MatchRightView from './avails/right-matching/match-rights/MatchRightsView';
import TitleMatchView from './avails/title-matching/TitleMatchView';
import TitleMatchReview from './avails/title-matching/TitleMatchReview/TitleMatchReview';

const routes = (
    <Switch>
        <Route exact path="/" component={Welcome}/>
        <Route exact path="/avails" component={canRender(RightDashboardContainer, 'read', 'Avail')}/>
        <Route exact path="/avails/rights" component={canRender(RightDashboardContainer, 'read', 'Avail')}/>
        <Route exact path="/avails/rights/create" component={canRender(RightCreate, 'create', 'Avail')}/>
        <Route exact path="/avails/rights/:id" component={canRender(RightDetails, 'read', 'Avail')}/>
        <Route exact path="/avails/rights/create/v2" component={canRender(RightCreateV2, 'create', 'Avail')}/>
        <Route exact path="/avails/rights/" component={canRender(RightDetails, 'read', 'Avail')}/>
        <Route exact path="/avails/history/create_from_attachments" component={canRender(RightsCreateFromAttachment, 'create', 'Avail')}/>
        <Route exact path="/avails/history/fix-errors" component={canRender(FixRights, 'update', 'Avail')}/>
        <Route exact path="/avails/history/:availHistoryIds/fix-errors" component={canRender(FixRights, 'update', 'Avail')}/>
        <Route exact path="/avails/history/:availHistoryIds/:valid(errors)" component={canRender(RightDashboardContainer, 'read', 'Avail')}/>
        <Route exact path="/avails/history/:availHistoryIds/create_from_attachments" component={canRender(RightsCreateFromAttachment, 'create', 'Avail')}/>
        <Route exact path="/avails/history/:availHistoryId/rights/create" component={canRender(RightCreate, 'create', 'Avail')}/>
        <Route exact path="/avails/history/:availHistoryIds" component={canRender(RightDashboardContainer, 'read', 'Avail')}/>
        <Route exact path="/avails/history" component={canRender(AvailIngestHistoryContainer, 'read', 'Avail')}/>
        <Route exact path="/avails/history/:availHistoryIds/right_matching" component={canRender(RightMatchingView, 'update', 'Avail')}/>
        <Route exact path="/avails/history/:availHistoryIds/right_matching/:rightId" component={canRender(RightToMatchView, 'update', 'Avail')}/>
        <Route exact path="/avails/history/:availHistoryIds/right_matching/:rightId/match/:matchedRightId" component={canRender(MatchRightView, 'update', 'Avail')}/>
        <Route exact path="/avails/select_rights_planning" component={canRender(SelectRightsPlanning, 'update', 'Avail')}/>
        <Route exact path="/avails/rights/:rightId/title_matching" component={canRender(TitleMatchView, 'update', 'Avail')}/>
        <Route exact path="/avails/rights/:rightId/title_matching/review" component={canRender(TitleMatchReview, 'update', 'Avail')}/>
        <Route exact path="/metadata" component={canRender(MetadataDashboardContainer, 'read', 'Metadata')} />
        <Route path="/metadata/detail/:id" component={canRender(TitleEdit, 'read', 'Metadata')} />
        <Route exact path="/contractprofile" component={ContractProfile} />
        <Route exact path="/contractsearch" component={Contract} />
        <Route exact path="/Media" component={canRender(Media, 'read', 'AssetManagement')} />
        <Route exact path="/settings" component={Settings} />
        <Route component={NotFound} />
    </Switch>
);

export default routes;
