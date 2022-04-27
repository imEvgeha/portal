import React from 'react';
import {Outlet} from 'react-router-dom';

const LegacyTitleReconciliationViewImport = import(
    '../metadata/legacy-title-reconciliation/LegacyTitleReconciliationView'
);
const LegacyTitleReconciliationView = React.lazy(() => LegacyTitleReconciliationViewImport);
const LegacyTitleReconciliationReviewImport = import(
    '../metadata/legacy-title-reconciliation/review/LegacyTitleReconciliationReview'
);
const LegacyTitleReconciliationReview = React.lazy(() => LegacyTitleReconciliationReviewImport);

const TitleMetadataViewImport = import(/* webpackChunkName: "TitleMetadata" */ './TitleMetadataView');
const TitleMetadataView = React.lazy(() => TitleMetadataViewImport);
const TitleDetailsImport = import(
    /* webpackChunkName: "TitleDetails" */ './components/title-metadata-details/TitleDetails'
);
const TitleDetails = React.lazy(() => TitleDetailsImport);

export const BASE_PATH = '/metadata';

const routes = [
    {
        index: true,
        key: 'metadata',
        element: TitleMetadataView,
    },
    {
        path: 'detail/:id',
        element: Outlet,
        children: [
            {
                index: true,
                key: 'metadata-details',
                element: TitleDetails,
                roles: {
                    operation: 'OR',
                    values: ['metadata_view'],
                },
            },
            {
                path: 'legacy-title-reconciliation',
                element: LegacyTitleReconciliationView,
                roles: {
                    operation: 'OR',
                    values: ['metadata_view'],
                },
            },
            {
                path: 'legacy-title-reconciliation/review',
                element: LegacyTitleReconciliationReview,
                roles: {
                    operation: 'OR',
                    values: ['metadata_view'],
                },
            },
        ],
    },
];

export default routes;
