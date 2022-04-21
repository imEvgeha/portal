import React from 'react';

const ServicingOrdersViewImport = import(/* webpackChunkName: "ServicingOrdersView" */ './ServicingOrdersView');
const ServicingOrdersView = React.lazy(() => ServicingOrdersViewImport);
const ServicingOrderImport = import(/* webpackChunkName: "ServicingOrder" */ './servicing-order/ServicingOrder');
const ServicingOrder = React.lazy(() => ServicingOrderImport);

const routes = [
    {
        index: true,
        key: 'servicing-orders',
        element: ServicingOrdersView,
    },
    {
        path: ':id',
        element: ServicingOrder,
    },
];

export default routes;
