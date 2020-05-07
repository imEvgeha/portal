import React from 'react';
import {canRender} from '../../ability';
import ServicingOrdersView from './ServicingOrdersView';

const BASE_PATH = '/servicing-orders';

const routes = [
    {
        path: BASE_PATH,
        component: canRender(ServicingOrdersView, 'read', 'ServicingOrders'),
    },
    {
        path: `${BASE_PATH}/:id`,
    }
];

export default routes;
