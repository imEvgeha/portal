import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route} from 'react-router-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import ChooseArtwork from './ChooseArtwork';
import {store} from './portal-mf-media-asset-management';

export default function Root(props) {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Route
                    path="/media-asset-management"
                    component={routerProps => <ChooseArtwork {...routerProps} {...props} />}
                />
            </BrowserRouter>
        </Provider>
    );
}
