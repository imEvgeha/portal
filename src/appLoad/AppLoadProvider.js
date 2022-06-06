import {useEffect, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import {keycloak, KEYCLOAK_INIT_OPTIONS} from '@portal/portal-auth';
import {injectUser, logout} from '@portal/portal-auth/authActions';
import {getValidToken} from '@portal/portal-auth/utils';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {connect} from 'react-redux';
import {store} from '../index';
import {getSelectValues} from '../pages/avails/right-details/rightDetailsActions';
import {fetchAvailMapping} from '../pages/legacy/containers/avail/availActions';

const AppLoadProvider = ({
    children,
    options = KEYCLOAK_INIT_OPTIONS,
    configEndpointsLoading,
    getAppOptions,
    logoutUser,
    getSelectValues,
}) => {
    useEffect(() => {
        if (!configEndpointsLoading) {
            getAppOptions();
        }
    }, [configEndpointsLoading]);

    useLayoutEffect(() => {
        let cancel = false;
        const runEffect = async () => {
            try {
                const {token, refreshToken} = store.getState().auth;
                const isAuthenticated = await keycloak.init({
                    ...options,
                    token: getValidToken(token, getConfig('keycloak.url')),
                    refreshToken: getValidToken(refreshToken, getConfig('keycloak.url')),
                });
                if (isAuthenticated) {
                    getSelectValues();
                }
            } catch (error) {
                logoutUser();
            }
            if (cancel) {
                return;
            }
        };

        runEffect();
        return () => {
            cancel = true;
        };
    }, []);

    return children;
};

const mapStateToProps = state => {
    return {
        appOptions: state.root?.selectValues,
        configEndpointsLoading: state.avails?.rightDetailsOptions?.endpointsLoading,
    };
};
const mapDispatchToProps = dispatch => ({
    getAppOptions: () => dispatch(fetchAvailMapping()),
    addUser: payload => dispatch(injectUser(payload)),
    logoutUser: () => dispatch(logout()),
    getSelectValues: () => dispatch(getSelectValues()),
});

AppLoadProvider.defaultProps = {
    options: undefined,
    appOptions: undefined,
    addUser: undefined,
    getAppOptions: undefined,
    logoutUser: undefined,
    getSelectValues: undefined,
};

AppLoadProvider.propTypes = {
    options: PropTypes.any,
    appOptions: PropTypes.any,
    addUser: PropTypes.any,
    getAppOptions: PropTypes.any,
    logoutUser: PropTypes.any,
    getSelectValues: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLoadProvider);
