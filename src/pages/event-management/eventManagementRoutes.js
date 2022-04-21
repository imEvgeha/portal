import React from 'react';

const EventManagementImport = import(/* webpackChunkName: "EventManagement" */ './EventManagement');
const EventManagement = React.lazy(() => EventManagementImport);

const routes = [
    {
        index: true,
        key: 'event-management',
        element: EventManagement,
        roles: {
            operation: 'OR',
            values: ['event_viewer'],
        },
    },
];

export default routes;
