import React from 'react';
import {EVENT_MANAGEMENT} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-navigation/constants';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';

const EventManagementImport = import(/* webpackChunkName: "EventManagement" */ './EventManagement');
const EventManagement = React.lazy(() => EventManagementImport);

const BASE_PATH = `/${EVENT_MANAGEMENT.toLowerCase()}`;

const routes = [
    {
        path: BASE_PATH,
        component: canRender(EventManagement, 'read', 'EventManagement'),
    },
];

export default routes;
