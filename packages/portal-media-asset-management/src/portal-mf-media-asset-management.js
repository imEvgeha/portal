import './set-public-path';
import React from 'react';
import {createBrowserHistory} from 'history';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import rootSaga from './saga.js';
import configureStore from './store';

const lifecycles = singleSpaReact({
    React,
    ReactDOM,
    loadRootComponent: () =>
        import(/* webpackChunkName: "media-asset-management-root-component" */ './root.component.js').then(
            mod => mod.default
        ),
});

export const {bootstrap} = lifecycles;
export const {mount} = lifecycles;
export const {unmount} = lifecycles;
const history = createBrowserHistory();
export const store = configureStore({}, history);
store.runSaga(rootSaga);
