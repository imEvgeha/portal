import NotFound from './NotFound';
import Welcome from './Welcome';

const routes = [
    {
        path: '/',
        component: Welcome
    },
    {
        path: '/v2',
        component: Welcome
    },
    {
        path: '*',
        component: NotFound
    },
];

export default routes;
