import React from 'react';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';

const ServicingOrdersViewImport = import(/* webpackChunkName: "ServicingOrdersView" */ './ServicingOrdersView');
const ServicingOrdersView = React.lazy(() => ServicingOrdersViewImport);
const ServicingOrderImport = import(/* webpackChunkName: "ServicingOrder" */ './servicing-order/ServicingOrder');
const ServicingOrder = React.lazy(() => ServicingOrderImport);

const BASE_PATH = '/servicing-orders';

const routes = [
    {
        path: BASE_PATH,
        component: canRender(ServicingOrdersView, 'read', 'ServicingOrders'),
    },
    {
        path: `${BASE_PATH}/:id`,
        component: canRender(ServicingOrder, 'read', 'ServicingOrders'),
    },
];

export default routes;
