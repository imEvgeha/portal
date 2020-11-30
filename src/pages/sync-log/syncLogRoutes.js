import React from 'react';
import {SYNC_LOG} from '@vubiquity-nexus/portal-ui/elements/nexus-navigation/constants';
import {canRender} from '../../ability';

const SyncLogViewImport = import(/* webpackChunkName: "SyncLog" */ './SyncLogView');
const SyncLogView = React.lazy(() => SyncLogViewImport);

const BASE_PATH = `/metadata/${SYNC_LOG.toLowerCase()}`;

const routes = [
    {
        path: BASE_PATH,
        component: canRender(SyncLogView, 'read', 'SyncLog'),
    },
];

export default routes;
