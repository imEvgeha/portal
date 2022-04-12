import React from 'react';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';

const ServicingOrdersViewImport = import(/* webpackChunkName: "ServicingOrdersView" */ './ServicingOrdersView');
const ServicingOrdersView = React.lazy(() => ServicingOrdersViewImport);
const ServicingOrderImport = import(/* webpackChunkName: "ServicingOrder" */ './servicing-order/ServicingOrder');
const ServicingOrder = React.lazy(() => ServicingOrderImport);

const routes = [
    {
        index: true,
        key: 'servicing-orders',
        element: canRender(ServicingOrdersView, 'read', 'ServicingOrders'),
    },
    {
        path: ':id',
        element: canRender(ServicingOrder, 'read', 'ServicingOrders'),
    },
];

export default routes;
