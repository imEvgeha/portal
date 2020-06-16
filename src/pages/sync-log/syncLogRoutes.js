import React from 'react';
import {canRender} from '../../ability';
import {SYNC_LOG} from '../../ui/elements/nexus-navigation/constants';
const SyncLogViewImport = import(/* webpackChunkName: "SyncLog" */ './SyncLogView');
const SyncLogView = React.lazy(() => SyncLogViewImport);

const BASE_PATH = `/${SYNC_LOG.toLowerCase()}`;

const routes = [
    {
        path: BASE_PATH,
        component: canRender(SyncLogView, 'read', 'SyncLog'),
    }
];

export default routes;
