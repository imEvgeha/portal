import React from 'react';
import {canRender} from '../../ability';

const TitleMetadataViewImport = import(/* webpackChunkName: "TitleMetadata" */ './TitleMetadataView');
const TitleMetadataView = React.lazy(() => TitleMetadataViewImport);

const BASE_PATH = '/metadata/v2';

const routes = [
    {
        path: BASE_PATH,
        component: canRender(TitleMetadataView, 'read', 'Metadata'),
    },
];

export default routes;
