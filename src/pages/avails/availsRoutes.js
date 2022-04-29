import React from 'react';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';
// TODO: change it to dynamic imports when we remove legacy override style for ag grid
// from RightsResultTable.scss to global.scss file
// currently, scss for particular component (RightsResultTable) is using for global ag grid style override
import {Outlet} from 'react-router-dom';
import RightsCreateFromAttachment from '../legacy/containers/avail/create/ManualRightsEntry/RightsCreateFromAttachment';
// use webpack prefetch for legacy routes
const RightCreate = React.lazy(() =>
    import(/* webpackPrefetch: true, webpackChunkName: "RightCreate" */ '../legacy/containers/avail/create/RightCreate')
);
const RightDetails = React.lazy(() => RightDetailsImport);
const RightDetailsImport = import(/* webpackChunkName: "RightCreateV2" */ './right-details/RightDetails');
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

const TitleMatchReviewImport = import(
    /* webpackChunkName: "TitleMatchReview" */ './title-matching/TitleMatchReview/TitleMatchReview'
);
const TitleMatchReview = React.lazy(() => TitleMatchReviewImport);

export const AVAILS_PATH = '/avails';

const routes = [
    {index: true, key: 'avails', element: canRender(AvailsView, 'read', 'Avail')},
    {
        path: 'rights',
        element: Outlet,
        children: [
            {
                path: 'create',
                element: canRender(RightCreate, 'create', 'Avail'),
            },
            {
                path: ':id',
                element: canRender(RightDetails, 'update', 'Avail'),
            },
            {
                path: ':rightId/title-matching',
                element: Outlet,
                children: [
                    {
                        path: 'review',
                        element: canRender(TitleMatchReview, 'update', 'Metadata'),
                    },
                ],
            },
        ],
    },
    {
        path: 'history',
        element: Outlet,
        children: [
            {
                path: 'manual-rights-entry',
                element: canRender(RightsCreateFromAttachment, 'create', 'Avail'),
            },

            {
                path: ':availHistoryId/rights/create',
                element: canRender(RightCreate, 'create', 'Avail'),
            },
            {
                path: ':availHistoryIds/right-matching',
                element: Outlet,
                children: [
                    {
                        key: 'availHistoryIds/right-matching',
                        index: true,
                        element: canRender(RightMatchingView, 'update', 'Avail'),
                    },
                    {
                        path: ':rightId',
                        element: canRender(RightToMatchView, 'update', 'Avail'),
                    },
                    {
                        path: ':rightId/match/:matchedRightIds',
                        element: canRender(MatchRightView, 'update', 'Avail'),
                    },
                ],
            },
            {
                path: ':availHistoryIds/manual-rights-entry',
                element: canRender(RightsCreateFromAttachment, 'create', 'Avail'),
            },
        ],
    },
    {
        path: 'right-matching',
        element: Outlet,
        children: [
            {
                key: 'right-matching',
                index: true,
                element: canRender(RightToRightMatchMerge, 'update', 'Avail'),
            },
            {
                path: 'preview',
                element: canRender(MatchRightViewMerge, 'update', 'Avail'),
            },
        ],
    },
];

export default routes;
