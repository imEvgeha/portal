import React from 'react';
import {canRender} from '../../ability';
import {SYNC_LOG} from '../../ui/elements/nexus-navigation/constants';
const SyncLogImport = import(/* webpackChunkName: "SyncLog" */ './SyncLog');
const SyncLog = React.lazy(() => SyncLogImport);

const BASE_PATH = `/${SYNC_LOG.toLowerCase()}`;

const routes = [
    {
        path: BASE_PATH,
        component: canRender(SyncLog, 'read', 'SyncLog'),
    }
];

export default routes;
