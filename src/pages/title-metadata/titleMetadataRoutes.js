import React from 'react';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';
import LegacyTitleReconciliationView from '../metadata/legacy-title-reconciliation/LegacyTitleReconciliationView';
import LegacyTitleReconciliationReview from '../metadata/legacy-title-reconciliation/review/LegacyTitleReconciliationReview';

const TitleMetadataViewImport = import(/* webpackChunkName: "TitleMetadata" */ './TitleMetadataView');
const TitleMetadataView = React.lazy(() => TitleMetadataViewImport);
const TitleDetailsImport = import(
    /* webpackChunkName: "TitleDetails" */ './components/title-metadata-details/TitleDetails'
);
const TitleDetails = React.lazy(() => TitleDetailsImport);

const BASE_PATH = '/metadata';

const routes = [
    {
        path: BASE_PATH,
        component: canRender(TitleMetadataView, 'read', 'Metadata'),
    },
    {
        path: `${BASE_PATH}/detail/:id`,
        component: canRender(TitleDetails, 'update', 'Metadata'),
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
