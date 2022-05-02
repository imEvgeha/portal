import React from 'react';

const EventManagementImport = import(/* webpackChunkName: "EventManagement" */ './EventManagement');
const EventManagement = React.lazy(() => EventManagementImport);

const routes = [
    {
        index: true,
        key: 'event-management',
        element: EventManagement,
        resource: 'eventManagementPage',
    },
];

export default routes;
