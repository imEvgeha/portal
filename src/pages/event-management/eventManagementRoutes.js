import React from 'react';
import {canRender} from '../../ability';
import {EVENT_MANAGEMENT} from '../../ui/elements/nexus-navigation/constants';

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
