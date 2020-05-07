import React from 'react';
import {canRender} from '../../ability';
import ServicingOrders from './ServicingOrders';
import ServicingOrder from './components/ServicingOrder/ServicingOrder';

const BASE_PATH = '/servicing-orders';

const routes = [
    {
        path: BASE_PATH,
        component: canRender(ServicingOrders, 'read', 'ServicingOrders'),
    },
    {
        path: `${BASE_PATH}/:id`,
        component: canRender(ServicingOrder, 'read', 'ServicingOrders'),
    }
];

export default routes;
