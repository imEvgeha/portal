import React from 'react';
import {canRender} from '../../ability';

const TitleMetadataViewImport = import(/* webpackChunkName: "TitleMetadata" */ './TitleMetadataView');
const TitleMetadataView = React.lazy(() => TitleMetadataViewImport);
const TitleDetailsImport = import(
    /* webpackChunkName: "TitleDetails" */ './components/title-metadata-details/TitleDetails'
);
const TitleDetails = React.lazy(() => TitleDetailsImport);

const BASE_PATH = '/metadata/v2';

const routes = [
    {
        path: BASE_PATH,
        component: canRender(TitleMetadataView, 'read', 'Metadata'),
    },
    {
        path: `${BASE_PATH}/detail/:id`,
        component: canRender(TitleDetails, 'update', 'Metadata'),
    },
];

export default routes;
