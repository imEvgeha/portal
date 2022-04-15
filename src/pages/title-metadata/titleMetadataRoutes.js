import React from 'react';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';
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
        element: canRender(TitleMetadataView, 'read', 'Metadata'),
    },
    {
        path: 'detail/:id',
        element: Outlet,
        children: [
            {
                index: true,
                key: 'metadata-details',
                element: canRender(TitleDetails, 'update', 'Metadata'),
            },
            {
                path: 'legacy-title-reconciliation',
                element: canRender(LegacyTitleReconciliationView, 'update', 'Metadata'),
            },
            {
                path: 'legacy-title-reconciliation/review',
                element: canRender(LegacyTitleReconciliationReview, 'update', 'Metadata'),
            },
        ],
    },
];

export default routes;
