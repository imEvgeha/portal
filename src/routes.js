import {canRender} from './ability';
import availsRoutes from './pages/avails/availsRoutes';
import metadataRoutes from './pages/metadata/metadataRoutes';
import staticPagesRoutes from './pages/static/staticPagesRoutes';
import ContractProfile from './pages/legacy/containers/contracts/profile/ContractProfile';
import Contract from './pages/legacy/containers/contracts/search/Contract';
import Media from './pages/legacy/containers/media/search/Media.js';
import Settings from './pages/legacy/containers/settings/Settings';

// TODO: on relevant page refactoring remove in to corresponding page folder
const restRoutes = [
    {
        path: '/contractprofile',
        component: ContractProfile,
    },
    {
        path: '/contractsearch',
        component: Contract,
    },
    {
        path: '/media',
        component: canRender(Media, 'read', 'AssetManagement'),
    },
    {
        path: '/settings',
        component: Settings
    }
];

const routes = [
    ...availsRoutes,
    ...metadataRoutes,
    ...restRoutes,
    ...staticPagesRoutes,
];

export default routes;
