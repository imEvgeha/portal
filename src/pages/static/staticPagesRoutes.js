import Welcome from './Welcome';
import NotFound from './NotFound';

const routes = [
    {
        path: '/',
        component: Welcome,
    },
    {
        path: '/v2',
        component: Welcome,
    },
    {
        path: '*',
        component: NotFound,
    },
];

export default routes;
