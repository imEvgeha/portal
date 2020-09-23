import React from 'react';
import {canRender} from '../../ability';

const DopTasksViewImport = import(/* webpackChunkName: "DopTasks" */ './DopTasksView');
const DopTasksView = React.lazy(() => DopTasksViewImport);

const BASE_PATH = '/dop-tasks';

const routes = [
    {
        path: BASE_PATH,
        component: canRender(DopTasksView, 'read', 'DopTasks'),
    },
];

export default routes;
