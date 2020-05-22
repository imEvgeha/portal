import React, {useState, useLayoutEffect, useEffect} from 'react';
import {connect} from 'react-redux';
import jwtDecode from 'jwt-decode';
import config from 'react-global-configuration';
import {isEmpty} from 'lodash';
import {store} from '../index';
import {
    loadDashboardState,
    loadHistoryState,
    loadCreateRightState,
    loadDopState,
    loadManualRightEntryState
} from '../pages/legacy/stores/index';
import {loadProfileInfo} from '../pages/legacy/stores/actions';
import {updateAbility} from '../ability';
import {injectUser, logout} from './authActions';
import {getValidToken, getTokenDuration, wait} from './utils';
import Loading from '../pages/static/Loading';
import {keycloak, KEYCLOAK_INIT_OPTIONS} from './keycloak';
import {fetchAvailMapping} from '../pages/legacy/containers/avail/availActions';

const MIN_VALIDITY_SEC = 30;
const BEFORE_TOKEN_EXP = (MIN_VALIDITY_SEC - 5) * 1000;

const AuthProvider = ({children, options = KEYCLOAK_INIT_OPTIONS, appOptions, injectUser, getAppOptions}) => {
 // excecution until the user is Authenticated
    const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isEmpty(appOptions) && isAuthenticatedUser) {
            setIsLoading(false);
        }
    }, [appOptions, isAuthenticatedUser]);

    useLayoutEffect(() => {
        let cancel = false;
        const runEffect = async () => {
            try {
                const {token, refreshToken} = store.getState().auth;
                const isAuthenticated = await keycloak.init({
                    ...options,
                    token: getValidToken(token, config.get('keycloak.url')),
                    refreshToken: getValidToken(refreshToken, config.get('keycloak.url')),
                });
                if (isAuthenticated) {
                    const {realmAccess, token, refreshToken} = keycloak;
                    const {roles} = realmAccess || {};
                    updateAbility(roles);
                    injectUser({token, refreshToken});
                    loadUserAccount();
                    loadDashboardState(); // TODO: to remove 
                    loadCreateRightState(); // TODO: to remove 
                    loadHistoryState(); // TODO: to remove
                    loadDopState(); // TODO: to remove
                    loadProfileInfo();
                    // get config options for app
                    getAppOptions();

                    updateUserToken(token);
                } else {
                    // window.location.reload();
                }
                setIsAuthenticatedUser(isAuthenticated);

            } catch (error) {
                store.dispatch(logout()); 
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

    const loadUserAccount = async () => {
        const userAccount = await keycloak.loadUserProfile();
        injectUser({userAccount});
        return userAccount;
    };

    const updateUserToken = async (accessToken) => {
        try {
            const token = getValidToken(accessToken);
            if (!token) {
                logout();
            }
            const tokenDuration = getTokenDuration(jwtDecode(token));

            // timeout
            if (tokenDuration > BEFORE_TOKEN_EXP) {
                const DELAY = tokenDuration - BEFORE_TOKEN_EXP;
                await wait(DELAY);
            }

            // update token; store new tokens
            const isRefreshed = await keycloak.updateToken(MIN_VALIDITY_SEC);
            if (isRefreshed) {
                injectUser({token: keycloak.token, refreshToken: keycloak.refreshToken});
            }

            // recursion
            updateUserToken(keycloak.token);

        } catch (error) {
            logout();
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return children;
};

const mapStateToProps = ({root}) => ({
    appOptions: root.selectValues
});

const mapDispatchToProps = dispatch => ({
    getAppOptions: () => dispatch(fetchAvailMapping()),
    injectUser: payload => dispatch(injectUser(payload)),
    logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthProvider);
