import React, {Suspense} from 'react';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import {Switch, Route, withRouter} from 'react-router-dom';
import Loading from './pages/static/Loading';
import {clearTitleMetadataFilter} from './pages/title-metadata/titleMetadataActions';
import {BASE_PATH} from './pages/title-metadata/titleMetadataRoutes';
import {createTitleMetadataFilterSelector} from './pages/title-metadata/titleMetadataSelectors';

const Router = ({routes, history, titleMetadataFilter, clearTitleMetadataFilter}) => {
    if (`/${history.location.pathname.split('/', 2)[1]}` !== BASE_PATH && !isEmpty(titleMetadataFilter)) {
        clearTitleMetadataFilter();
    }

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
    titleMetadataFilter: PropTypes.object,
    clearTitleMetadataFilter: PropTypes.func,
};

Router.defaultProps = {
    history: {},
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Router));
