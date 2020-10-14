import React from 'react';
import {canRender} from '../../ability';

const MetadataDashboardContainer = React.lazy(() =>
    import(
        /* webpackPrefetch: true, webpackChunkName: "MetadataDashboardContainer" */ '../legacy/containers/metadata/dashboard/DashboardContainer'
    )
);
const TitleEdit = React.lazy(() =>
    import(
        /* webpackPrefetch: true, webpackChunkName: "TitleEdit" */ '../legacy/containers/metadata/dashboard/components/TitleEdit'
    )
);
const LegacyTitleReconciliationViewImport = import(
    /* webpackChunkName: "LegacyTitleReconciliationView" */ './legacy-title-reconciliation/LegacyTitleReconciliationView'
);
const LegacyTitleReconciliationView = React.lazy(() => LegacyTitleReconciliationViewImport);
const LegacyTitleReconciliationReviewImport = import(
    /* webpackChunkName: "LegacyTitleReconciliationReview" */ './legacy-title-reconciliation/review/LegacyTitleReconciliationReview'
);
const LegacyTitleReconciliationReview = React.lazy(() => LegacyTitleReconciliationReviewImport);

const BASE_PATH = '/metadata';

const routes = [
    {
        path: BASE_PATH,
        component: canRender(MetadataDashboardContainer, 'read', 'Metadata'),
    },
    {
        path: `${BASE_PATH}/detail/:id`,
        component: canRender(TitleEdit, 'read', 'Metadata'),
    },
    {
        path: `${BASE_PATH}/detail/:id/legacy-title-reconciliation`,
        component: canRender(LegacyTitleReconciliationView, 'update', 'Metadata'),
    },
    {
        path: `${BASE_PATH}/detail/:id/legacy-title-reconciliation/review`,
        component: canRender(LegacyTitleReconciliationReview, 'update', 'Metadata'),
    },
];

export default routes;
