import React from 'react';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';

const EventManagementImport = import(/* webpackChunkName: "EventManagement" */ './EventManagement');
const EventManagement = React.lazy(() => EventManagementImport);

const routes = [
    {
        index: true,
        key: 'event-management',
        element: canRender(EventManagement, 'read', 'EventManagement'),
    },
];

export default routes;
