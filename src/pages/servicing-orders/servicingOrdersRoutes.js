import React from 'react';
import {canRender} from '../../ability';
import ServicingOrder from './components/ServicingOrder/ServicingOrder';

const ServicingOrdersViewImport = import(/* webpackChunkName: "ServicingOrdersView" */ './ServicingOrdersView');
const ServicingOrdersView = React.lazy(() => ServicingOrdersViewImport);

const BASE_PATH = '/servicing-orders';

const routes = [
    {
        path: BASE_PATH,
        component: canRender(ServicingOrdersView, 'read', 'ServicingOrders'),
    },
    {
        path: `${BASE_PATH}/:id`,
        component: canRender(ServicingOrder, 'read', 'ServicingOrders'),
    }
];

export default routes;
