import React, {Suspense} from 'react';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import {Route, Switch, useHistory} from 'react-router-dom';
import Loading from './pages/static/Loading';
import {clearTitleMetadataFilter} from './pages/title-metadata/titleMetadataActions';
import {BASE_PATH} from './pages/title-metadata/titleMetadataRoutes';
import {createTitleMetadataFilterSelector} from './pages/title-metadata/titleMetadataSelectors';

const Router = ({routes, titleMetadataFilter, clearTitleMetadataFilter}) => {
    const history = useHistory();
    if (`/${history.location.pathname.split('/', 2)[1]}` !== BASE_PATH && !isEmpty(titleMetadataFilter)) {
        clearTitleMetadataFilter();
    }

    return (
        <Suspense fallback={<Loading />}>
            <Switch>{routes.map(route => buildRoute(route))}</Switch>
        </Suspense>
    );
};

const buildRoute = route => {
    const {path, component: Component, routes: children, ...rest} = route;
    return (
        <Route key={path} path={path} exact {...rest}>
            <Component {...rest} />
            {children?.map(childRoute => buildRoute(childRoute))}
        </Route>
    );
};

Router.propTypes = {
    routes: PropTypes.array.isRequired,
    titleMetadataFilter: PropTypes.object,
    clearTitleMetadataFilter: PropTypes.func,
};

Router.defaultProps = {
    titleMetadataFilter: {},
    clearTitleMetadataFilter: () => null,
};

const mapStateToProps = () => {
    const titleMetadataFilterSelector = createTitleMetadataFilterSelector();
    return state => ({
        titleMetadataFilter: titleMetadataFilterSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    clearTitleMetadataFilter: payload => dispatch(clearTitleMetadataFilter(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Router);
