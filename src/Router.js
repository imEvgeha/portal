import React, {Suspense} from 'react';
import PropTypes from 'prop-types';
import {Switch, Route, withRouter} from 'react-router-dom';
import Loading from './pages/static/Loading';
import {BASE_PATH} from './pages/title-metadata/titleMetadataRoutes';

const Router = ({routes, history}) => {
    setTimeout(() => {
        if (`/${  history.location.pathname.split('/', 2)[1]}` !== BASE_PATH) {
            sessionStorage.removeItem('storedMetadataFilter');
        }
    }, 2000);

    return (
        <Suspense fallback={<Loading />}>
            <Switch>
                {routes.map(({path, Component, routes: children, ...rest}) => (
                    <Route
                        key={path}
                        path={path}
                        exact
                        component={props => (
                            <>
                                <Component {...props} />
                                {children && children.length > 0 ? <Router {...props} routes={children} /> : null}
                            </>
                        )}
                        {...rest}
                    />
                ))}
            </Switch>
        </Suspense>
    );
};

Router.propTypes = {
    routes: PropTypes.array.isRequired,
    history: PropTypes.object,
};

Router.defaultProps = {
    history: {},
};

export default withRouter(Router);
