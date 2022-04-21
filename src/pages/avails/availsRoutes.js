import React from 'react';
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

const TitleMatchViewImport = import(/* webpackChunkName: "TitleMatchView" */ './title-matching/TitleMatchView');
const TitleMatchView = React.lazy(() => TitleMatchViewImport);
const TitleMatchReviewImport = import(
    /* webpackChunkName: "TitleMatchReview" */ './title-matching/TitleMatchReview/TitleMatchReview'
);
const TitleMatchReview = React.lazy(() => TitleMatchReviewImport);

export const AVAILS_PATH = '/avails';

const routes = [
    {
        index: true,
        key: 'avails',
        element: AvailsView,
    },
    {
        path: 'rights',
        element: Outlet,
        children: [
            {
                path: 'create',
                element: RightCreate,
                roles: {
                    operation: 'OR',
                    values: ['avails_user', 'avails_admin'],
                },
            },
            {
                path: ':id',
                element: RightDetails,
                roles: {
                    operation: 'OR',
                    values: ['avails_user', 'avails_admin'],
                },
            },
            {
                path: ':rightId/title-matching',
                element: Outlet,
                children: [
                    {
                        index: true,
                        key: 'rightId/title-matching',
                        element: TitleMatchView,
                        roles: {
                            operation: 'OR',
                            values: ['metadata_user', 'metadata_admin'],
                        },
                    },
                    {
                        path: 'review',
                        element: TitleMatchReview,
                        roles: {
                            operation: 'OR',
                            values: ['metadata_user', 'metadata_admin'],
                        },
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
                element: RightsCreateFromAttachment,
                roles: {
                    operation: 'OR',
                    values: ['avails_user', 'avails_admin'],
                },
            },

            {
                path: ':availHistoryId/rights/create',
                element: RightCreate,
                roles: {
                    operation: 'OR',
                    values: ['avails_user', 'avails_admin'],
                },
            },
            {
                path: ':availHistoryIds/right-matching',
                element: Outlet,
                children: [
                    {
                        key: 'availHistoryIds/right-matching',
                        index: true,
                        element: RightMatchingView,
                        roles: {
                            operation: 'OR',
                            values: ['avails_user', 'avails_admin'],
                        },
                    },
                    {
                        path: ':rightId',
                        element: RightToMatchView,
                        roles: {
                            operation: 'OR',
                            values: ['avails_user', 'avails_admin'],
                        },
                    },
                    {
                        path: ':rightId/match/:matchedRightIds',
                        element: MatchRightView,
                        roles: {
                            operation: 'OR',
                            values: ['avails_user', 'avails_admin'],
                        },
                    },
                ],
            },
            {
                path: ':availHistoryIds/manual-rights-entry',
                element: RightsCreateFromAttachment,
                roles: {
                    operation: 'OR',
                    values: ['avails_user', 'avails_admin'],
                },
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
                element: RightToRightMatchMerge,
                roles: {
                    operation: 'OR',
                    values: ['avails_user', 'avails_admin'],
                },
            },
            {
                path: 'preview',
                element: MatchRightViewMerge,
                roles: {
                    operation: 'OR',
                    values: ['avails_user', 'avails_admin'],
                },
            },
        ],
    },
];

export default routes;
