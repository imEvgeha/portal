import React, {useState, useLayoutEffect, useEffect} from 'react';
import {injectUser, logout} from '@vubiquity-nexus/portal-auth/authActions';
import {keycloak, KEYCLOAK_INIT_OPTIONS} from '@vubiquity-nexus/portal-auth/keycloak';
import {getValidToken, getTokenDuration, wait} from '@vubiquity-nexus/portal-auth/utils';
import {updateAbility} from '@vubiquity-nexus/portal-utils/lib/ability';
import jwtDecode from 'jwt-decode';
import config from 'react-global-configuration';
import {connect} from 'react-redux';
import {store} from '../index';
import {getSelectValues} from '../pages/avails/right-details/rightDetailsActions';
import DOPService from '../pages/avails/selected-for-planning/DOP-services';
import {fetchAvailMapping} from '../pages/legacy/containers/avail/availActions';
import {loadProfileInfo} from '../pages/legacy/stores/actions';
import Loading from '../pages/static/Loading';

const MIN_VALIDITY_SEC = 30;
// eslint-disable-next-line no-magic-numbers
const BEFORE_TOKEN_EXP = (MIN_VALIDITY_SEC - 5) * 1000;

const AuthProvider = ({
    children,
    options = KEYCLOAK_INIT_OPTIONS,
    appOptions,
    addUser,
    getAppOptions,
    logoutUser,
    getSelectValues,
}) => {
    // excecution until the user is Authenticated
    const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticatedUser) {
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
                    addUser({token, refreshToken});
                    loadUserAccount();
                    loadProfileInfo();
                    // get config options for app
                    getAppOptions();

                    updateUserToken(token);
                    getSelectValues();
                } else {
                    // window.location.reload();
                }
                setIsAuthenticatedUser(isAuthenticated);
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

    const loadUserAccount = async () => {
        const userAccount = await keycloak.loadUserProfile();
        DOPService.getSecurityTicket({token: keycloak.token});
        addUser({userAccount});
        return userAccount;
    };

    const updateUserToken = async accessToken => {
        try {
            const token = getValidToken(accessToken);
            if (!token) {
                logoutUser();
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
                addUser({token: keycloak.token, refreshToken: keycloak.refreshToken});
            }

            // recursion
            updateUserToken(keycloak.token);
        } catch (error) {
            logoutUser();
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return children;
};

const mapStateToProps = ({root}) => ({
    appOptions: root.selectValues,
});

const mapDispatchToProps = dispatch => ({
    getAppOptions: () => dispatch(fetchAvailMapping()),
    addUser: payload => dispatch(injectUser(payload)),
    logoutUser: () => dispatch(logout()),
    getSelectValues: () => dispatch(getSelectValues()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthProvider);
