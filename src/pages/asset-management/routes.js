import React from 'react';
import {canRender} from '@vubiquity-nexus/portal-utils/lib/ability';
import {CHOOSE_ARTWORK_PATH} from './constants';

const ChooseArtworkImport = import(/* webpackChunkName: "AssetManagement" */ './ChooseArtwork');
const ChooseArtwork = React.lazy(() => ChooseArtworkImport);

const routes = [
    {
        path: CHOOSE_ARTWORK_PATH,
        component: canRender(ChooseArtwork, 'read', 'AssetManagement'),
    },
];

export default routes;
