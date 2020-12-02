import React from 'react';
import {canRender} from '../../ability';
// TODO: change it to dynamic imports when we remove legacy override style for ag grid
// from RightsResultTable.scss to global.scss file
// currently, scss for particular component (RightsResultTable) is using for global ag grid style override
import RightsCreateFromAttachment from '../legacy/containers/avail/create/ManualRightsEntry/RightsCreateFromAttachment';
// use webpack prefetch for legacy routes
const RightDashboardContainer = React.lazy(() =>
    import(
        /* webpackPrefetch: true, webpackChunkName: "DashboardContainer" */ '../legacy/containers/avail/dashboard/DashboardContainer'
    )
);
const RightCreate = React.lazy(() =>
    import(/* webpackPrefetch: true, webpackChunkName: "RightCreate" */ '../legacy/containers/avail/create/RightCreate')
);
const RightDetails = React.lazy(() => RightDetailsImport);
const RightDetailsImport = import(/* webpackChunkName: "RightCreateV2" */ './right-details/RightDetails');
const SelectRightsPlanning = React.lazy(() =>
    import(
        /* webpackPrefetch: true, webpackChunkName: "SelectRightPlanning" */ '../legacy/containers/avail/DOP/SelectRightsPlanning'
    )
);
const AvailIngestHistoryContainer = React.lazy(() =>
    import(
        /* webpackPrefetch: true, webpackChunkName: "AvailIngestHistoryContainer" */ '../legacy/containers/avail/ingest-history/AvailIngestHistoryContainer'
    )
);
const RightMatchingViewImport = import(
    /* webpackChunkName: "RightMatchingView" */ './right-matching/RightMatchingView'
);
const RightMatchingView = React.lazy(() => RightMatchingViewImport);
const AvailsViewImport = import(/* webpackChunkName: "AvailsView" */ './AvailsView');
const AvailsView = React.lazy(() => AvailsViewImport);
const RightToMatchViewImport = import(
    /* webpackChunkName: "RightToMatchView" */ './right-matching/right-to-match/RightToMatchView'
);
const RightToMatchView = React.lazy(() => RightToMatchViewImport);
const RightToRightMatchMergeImport = import(
    /* webpackChunkName: "RightToMatchViewMerge" */ './right-matching/right-to-match/RightToMatchView'
);
const RightToRightMatchMerge = React.lazy(() => RightToRightMatchMergeImport);
const MatchRightViewImport = import(
    /* webpackChunkName: "MatchRightView" */ './right-matching/match-rights/MatchRightsView'
);
const MatchRightView = React.lazy(() => MatchRightViewImport);

const MatchRightViewMergeImport = import(
    /* webpackChunkName: "MatchRightViewMerge" */ './right-matching/match-rights/MatchRightsView'
);
const MatchRightViewMerge = React.lazy(() => MatchRightViewMergeImport);

const TitleMatchViewImport = import(/* webpackChunkName: "TitleMatchView" */ './title-matching/TitleMatchView');
const TitleMatchView = React.lazy(() => TitleMatchViewImport);
const TitleMatchReviewImport = import(
    /* webpackChunkName: "TitleMatchReview" */ './title-matching/TitleMatchReview/TitleMatchReview'
);
const TitleMatchReview = React.lazy(() => TitleMatchReviewImport);

const BASE_PATH = '/avails';
export const AVAILS_PATH = '/avails/v2';

// TODO: create nested structure of routes
const routes = [
    {
        path: BASE_PATH,
        component: canRender(RightDashboardContainer, 'read', 'Avail'),
    },
    {
        path: `${AVAILS_PATH}`,
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
        path: `${BASE_PATH}/rights/:id`,
        component: canRender(RightDetails, 'update', 'Avail'),
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
        path: `${BASE_PATH}/right-matching`,
        component: canRender(RightToRightMatchMerge, 'update', 'Avail'),
    },
    {
        path: `${BASE_PATH}/right-matching/preview`,
        component: canRender(MatchRightViewMerge, 'update', 'Avail'),
    },
    {
        path: `${BASE_PATH}/select-rights-planning`,
        component: canRender(SelectRightsPlanning, 'update', 'Avail'),
    },
];

export default routes;
