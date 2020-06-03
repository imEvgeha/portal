import React, {useState, useLayoutEffect} from 'react';
import jwtDecode from 'jwt-decode';
import config from 'react-global-configuration';
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

const MIN_VALIDITY_SEC = 30;
const BEFORE_TOKEN_EXP = (MIN_VALIDITY_SEC - 5) * 1000;

const AuthProvider = ({children, options = KEYCLOAK_INIT_OPTIONS}) => {
 // excecution until the user is Authenticated
    const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
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
                    store.dispatch(injectUser({token, refreshToken}));
                    loadUserAccount();

                    loadDashboardState(); // TODO: to remove 
                    loadCreateRightState(); // TODO: to remove 
                    loadHistoryState(); // TODO: to remove
                    loadDopState(); // TODO: to remove
                    loadProfileInfo();

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
        store.dispatch(injectUser({userAccount}));
        return userAccount;
    };

    const updateUserToken = async (accessToken) => {
        try {
            const token = getValidToken(accessToken);
            if (!token) {
                store.dispatch(logout());
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
                store.dispatch(injectUser({token: keycloak.token, refreshToken: keycloak.refreshToken}));
            }

            // recursion
            updateUserToken(keycloak.token);

        } catch (error) {
            store.dispatch(logout());
        }
    };

    if (!isAuthenticatedUser) {
        return <Loading />;
    }

    return children;
};

export default AuthProvider;
