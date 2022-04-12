import React from 'react';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';

const DopTasksViewImport = import(/* webpackChunkName: "DopTasks" */ './DopTasksView');
const DopTasksView = React.lazy(() => DopTasksViewImport);

const routes = [
    {
        index: true,
        key: 'dop-tasks',
        element: canRender(DopTasksView, 'read', 'DopTasks'),
    },
];

export default routes;
