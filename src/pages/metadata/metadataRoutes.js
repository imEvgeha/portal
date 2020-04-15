import {canRender} from '../../ability';
import MetadataDashboardContainer from '../legacy/containers/metadata/dashboard/DashboardContainer';
import TitleEdit from '../legacy/containers/metadata/dashboard/components/TitleEdit';
import LegacyTitleReconciliationView from './legacy-title-reconciliation/LegacyTitleReconciliationView';
import LegacyTitleReconciliationReview from './legacy-title-reconciliation/review/LegacyTitleReconciliationReview';

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
    }
];

export default routes;
