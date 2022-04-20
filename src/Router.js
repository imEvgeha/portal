import React, {Suspense} from 'react';
import PropTypes from 'prop-types';
import RestrictedRoute from '@vubiquity-nexus/portal-auth/lib/permissions/RestrictedRoute';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import {Route, Routes, useLocation} from 'react-router-dom';
import Loading from './pages/static/Loading';
import {clearTitleMetadataFilter} from './pages/title-metadata/titleMetadataActions';
import {BASE_PATH} from './pages/title-metadata/titleMetadataRoutes';
import {createTitleMetadataFilterSelector} from './pages/title-metadata/titleMetadataSelectors';

const Router = ({routes, titleMetadataFilter, clearTitleMetadataFilter}) => {
    const location = useLocation();
    if (`/${location.pathname.split('/', 2)[1]}` !== BASE_PATH && !isEmpty(titleMetadataFilter)) {
        clearTitleMetadataFilter();
    }
    return <Routes>{routes.map(route => buildRoute(route))}</Routes>;
};

const buildRoute = route => {
    const {path, roles, key, element: Element, children, ...rest} = route;
    return (
        <Route
            key={path || key}
            path={path}
            exact
            {...rest}
            element={
                <RestrictedRoute roles={roles} isRoute>
                    <Suspense fallback={<Loading />}>
                        <Element />
                    </Suspense>
                </RestrictedRoute>
            }
        >
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
