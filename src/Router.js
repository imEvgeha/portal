import React from 'react';
import {Switch, Route} from 'react-router-dom';

const Router = ({routes}) => (
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
);

export default Router;
