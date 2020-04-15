import {canRender} from '../../ability';
import RightDashboardContainer  from '../legacy/containers/avail/dashboard/DashboardContainer';
import RightDetails  from '../legacy/containers/avail/details/RightDetails';
import RightCreate  from '../legacy/containers/avail/create/RightCreate';
import RightDetailsV2  from '../legacy/containers/avail/details/RightDetailsV2';
import RightCreateV2  from '../legacy/containers/avail/create/RightCreateV2';
import RightsCreateFromAttachment  from '../legacy/containers/avail/create/ManualRightsEntry/RightsCreateFromAttachment';
import SelectRightsPlanning  from '../legacy/containers/avail/DOP/SelectRightsPlanning';
import AvailIngestHistoryContainer from '../legacy/containers/avail/ingest-history/AvailIngestHistoryContainer';
import RightMatchingView from './right-matching/RightMatchingView';
import RightToMatchView from './right-matching/right-to-match/RightToMatchView';
import MatchRightView from './right-matching/match-rights/MatchRightsView';
import TitleMatchView from './title-matching/TitleMatchView';
import TitleMatchReview from './title-matching/TitleMatchReview/TitleMatchReview';
import AvailsView from './AvailsView';

const BASE_PATH = '/avails';

// TODO: create nested structure of routes
const routes = [
    {
        path: BASE_PATH,
        component: canRender(RightDashboardContainer, 'read', 'Avail'),
    },
    {
        path: `${BASE_PATH}/v2`,
        component: AvailsView,
    },
    {
        path: `${BASE_PATH}/rights`,
        component: canRender(RightDashboardContainer, 'read', 'Avail'),
    },
    {
        path: `${BASE_PATH}/rights/`,
        component: canRender(RightDetails, 'read', 'Avail'),
    },
    {
        path: `${BASE_PATH}/rights/create`,
        component: canRender(RightCreate, 'create', 'Avail'),
    },
    {
        path: `${BASE_PATH}/rights/create/v2`,
        component: canRender(RightCreateV2, 'create', 'Avail'),
    },
    {
        path: `${BASE_PATH}/rights/create/v2`,
        component: canRender(RightCreateV2, 'create', 'Avail'),
    },
    {
        path: `${BASE_PATH}/rights/:id`,
        component: canRender(RightDetails, 'read', 'Avail'),
    },
    {
        path: `${BASE_PATH}/rights/:id/v2`,
        component: canRender(RightDetailsV2, 'update', 'Avail'),
    },
    {
        path: `${BASE_PATH}/rights/:rightId/title-matching`,
        component: canRender(TitleMatchView, 'update', 'Metadata'),
    },
    {
        path: `${BASE_PATH}/rights/:rightId/title-matching/review`,
        component: canRender(TitleMatchReview, 'update', 'Metadata'),
    },
    {
        path: `${BASE_PATH}/history`,
        component: canRender(AvailIngestHistoryContainer, 'read', 'Avail'),
    },
    {
        path: `${BASE_PATH}/history/manual-rights-entry`,
        component: canRender(RightsCreateFromAttachment, 'create', 'Avail'),
    },
    {
        path: `${BASE_PATH}/history/:availHistoryIds/manual-rights-entry`,
        component: canRender(RightsCreateFromAttachment, 'create', 'Avail'),
    },
    {
        path: `${BASE_PATH}/history/:availHistoryId/rights/create`,
        component: canRender(RightCreate, 'create', 'Avail'),
    },
    {
        path: `${BASE_PATH}/history/:availHistoryIds`,
        component: canRender(RightDashboardContainer, 'read', 'Avail'),
    },
    {
        path: `${BASE_PATH}/history/:availHistoryIds/right-matching`,
        component: canRender(RightMatchingView, 'update', 'Avail'),
    },
    {
        path: `${BASE_PATH}/history/:availHistoryIds/right-matching/:rightId`,
        component: canRender(RightToMatchView, 'update', 'Avail'),
    },
    {
        path: `${BASE_PATH}/history/:availHistoryIds/right-matching/:rightId/match/:matchedRightIds`, 
        component: canRender(MatchRightView, 'update', 'Avail'),
    },
    {
        path: `${BASE_PATH}/select-rights-planning`,
        component: canRender(SelectRightsPlanning, 'update', 'Avail'),
    },
];

export default routes;

