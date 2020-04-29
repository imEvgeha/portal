import React, {Suspense} from 'react';
import {Switch, Route} from 'react-router-dom';
import Loading from './pages/static/Loading';

const Router = ({routes}) => (
    <Suspense fallback={<Loading />}>
        <Switch>
            {routes.map(({
                path,
                Component,
                routes: children,
                ...rest
            }) => (
                <Route
                    key={path}
                    path={path}
                    exact
                    component={props => (
                        <>
                            <Component {...props} />
                            {children && children.length > 0 ? (
                                <Router {...props} routes={children} />
                            ) : null}
                        </>
                    )}
                    {...rest}
                />
            ))}
        </Switch>
    </Suspense>
);

export default Router;