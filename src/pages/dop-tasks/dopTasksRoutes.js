import React from 'react';

const DopTasksViewImport = import(/* webpackChunkName: "DopTasks" */ './DopTasksView');
const DopTasksView = React.lazy(() => DopTasksViewImport);

const routes = [
    {
        index: true,
        key: 'dop-tasks',
        element: DopTasksView,
        roles: {
            operation: 'OR',
            values: ['dop_viewer'],
        },
    },
];

export default routes;
