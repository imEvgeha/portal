import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {canRender} from './ability';
import RightDashboardContainer  from './pages/legacy/containers/avail/dashboard/DashboardContainer';
import RightDetails  from './pages/legacy/containers/avail/details/RightDetails';
import RightCreate  from './pages/legacy/containers/avail/create/RightCreate';
import RightDetailsV2  from './pages/legacy/containers/avail/details/RightDetailsV2';
import RightCreateV2  from './pages/legacy/containers/avail/create/RightCreateV2';
import RightsCreateFromAttachment  from './pages/legacy/containers/avail/create/ManualRightsEntry/RightsCreateFromAttachment';
import SelectRightsPlanning  from './pages/legacy/containers/avail/DOP/SelectRightsPlanning';
import AvailIngestHistoryContainer from './pages/legacy/containers/avail/ingest-history/AvailIngestHistoryContainer';
import MetadataDashboardContainer from './pages/legacy/containers/metadata/dashboard/DashboardContainer';
import TitleEdit from './pages/legacy/containers/metadata/dashboard/components/TitleEdit';
import ContractProfile from './pages/legacy/containers/contracts/profile/ContractProfile';
import Contract from './pages/legacy/containers/contracts/search/Contract';
import Media from './pages/legacy/containers/media/search/Media.js';
import Settings from './pages/legacy/containers/settings/Settings';
import RightMatchingView from './pages/avails/right-matching/RightMatchingView';
import RightToMatchView from './pages/avails/right-matching/right-to-match/RightToMatchView';
import MatchRightView from './pages/avails/right-matching/match-rights/MatchRightsView';
import TitleMatchView from './pages/avails/title-matching/TitleMatchView';
import TitleMatchReview from './pages/avails/title-matching/TitleMatchReview/TitleMatchReview';
import AvailsView from './pages/avails/AvailsView';
import LegacyTitleReconciliationView from './pages/metadata/legacy-title-reconciliation/LegacyTitleReconciliationView';
import LegacyTitleReconciliationReview from './pages/metadata/legacy-title-reconciliation/review/LegacyTitleReconciliationReview';
import Welcome from './pages/static/Welcome';
import NotFound from './pages/static/NotFound';

const routes = (
    <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/avails" component={canRender(RightDashboardContainer, 'read', 'Avail')} />
        <Route exact path="/avails/rights" component={canRender(RightDashboardContainer, 'read', 'Avail')} />
        <Route exact path="/avails/rights/" component={canRender(RightDetails, 'read', 'Avail')} />
        <Route exact path="/avails/rights/create" component={canRender(RightCreate, 'create', 'Avail')} />
        <Route exact path="/avails/rights/:id" component={canRender(RightDetails, 'read', 'Avail')} />
        <Route exact path="/avails/rights/create/v2" component={canRender(RightCreateV2, 'create', 'Avail')} />
        <Route exact path="/avails/rights/:id/v2" component={canRender(RightDetailsV2, 'update', 'Avail')} />
        <Route exact path="/avails/rights/:rightId/title-matching" component={canRender(TitleMatchView, 'update', 'Metadata')} />
        <Route exact path="/avails/rights/:rightId/title-matching/review" component={canRender(TitleMatchReview, 'update', 'Metadata')} />
        <Route exact path="/avails/history" component={canRender(AvailIngestHistoryContainer, 'read', 'Avail')} />
        <Route exact path="/avails/history/manual-rights-entry" component={canRender(RightsCreateFromAttachment, 'create', 'Avail')} />
        <Route exact path="/avails/history/:availHistoryIds/manual-rights-entry" component={canRender(RightsCreateFromAttachment, 'create', 'Avail')} />
        <Route exact path="/avails/history/:availHistoryId/rights/create" component={canRender(RightCreate, 'create', 'Avail')} />
        <Route exact path="/avails/history/:availHistoryIds" component={canRender(RightDashboardContainer, 'read', 'Avail')} />
        <Route exact path="/avails/history/:availHistoryIds/right-matching" component={canRender(RightMatchingView, 'update', 'Avail')} />
        <Route exact path="/avails/history/:availHistoryIds/right-matching/:rightId" component={canRender(RightToMatchView, 'update', 'Avail')} />
        <Route exact path="/avails/history/:availHistoryIds/right-matching/:rightId/match/:matchedRightIds" component={canRender(MatchRightView, 'update', 'Avail')} />
        <Route exact path="/avails/select-rights-planning" component={canRender(SelectRightsPlanning, 'update', 'Avail')} />
        <Route exact path="/metadata" component={canRender(MetadataDashboardContainer, 'read', 'Metadata')} />
        <Route exact path="/metadata/detail/:id" component={canRender(TitleEdit, 'read', 'Metadata')} />
        <Route exact path="/metadata/detail/:id/legacy-title-reconciliation" component={canRender(LegacyTitleReconciliationView, 'update', 'Metadata')} />
        <Route exact path="/metadata/detail/:id/legacy-title-reconciliation/review" component={canRender(LegacyTitleReconciliationReview, 'update', 'Metadata')} />
        <Route exact path="/contractprofile" component={ContractProfile} />
        <Route exact path="/contractsearch" component={Contract} />
        <Route exact path="/Media" component={canRender(Media, 'read', 'AssetManagement')} />
        <Route exact path="/settings" component={Settings} />
        {/*TEMPORARY ROUTE FOR DISPLAYING THE NEW NAVIGATION*/}
        <Route exact path="/v2" component={Welcome} />
        <Route exact path="/avails/v2" component={AvailsView} />
        <Route component={NotFound} />
    </Switch>
);

export default routes;
