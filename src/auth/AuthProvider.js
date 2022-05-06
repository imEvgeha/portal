import React, {useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {keycloak, KEYCLOAK_INIT_OPTIONS} from '@portal/portal-auth';
import {injectUser, logout, setSelectedTenantInfo} from '@portal/portal-auth/authActions';
import {checkIfClientExistsInKeycloak, getTokenDuration, getValidToken, wait} from '@portal/portal-auth/utils';
import {getAuthConfig, getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import jwtDecode from 'jwt-decode';
import {isEmpty} from 'lodash';
import {connect, useDispatch} from 'react-redux';
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
    configEndpointsLoading,
    addUser,
    getAppOptions,
    logoutUser,
    getSelectValues,
}) => {
    // excecution until the user is Authenticated
    const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    // check if there is a persisted selectedTenant in Redux(from LocalStorage)
    const persistedSelectedTenant = localStorage.getItem('selectedTenant');

    useEffect(() => {
        if (!configEndpointsLoading) {
            getAppOptions();
        }
    }, [configEndpointsLoading]);

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
                    token: getValidToken(token, getConfig('keycloak.url')),
                    refreshToken: getValidToken(refreshToken, getConfig('keycloak.url')),
                });
                if (isAuthenticated) {
                    const {resourceAccess, token, refreshToken} = keycloak;

                    // set default tenant
                    AssignDefaultTenant(resourceAccess);
                    addUser({token, refreshToken});
                    loadUserAccount();
                    loadProfileInfo();
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

    /**
     * Assigns default tenant on application load if there is no data persisted on LocalStorage:
     * 1. Redux persisted from LocalStorage
     * 2. Realm (URL) - check the Realm from the /URL
     * 3. Clients[0] - assign the first client as the default tenant
     */
    const AssignDefaultTenant = resourceAccess => {
        // filter out clients that are not tenants
        const filteredResourceAccess = {...resourceAccess};
        delete filteredResourceAccess['account'];
        delete filteredResourceAccess['realm-management'];

        // Object.entries(resourceAccess)
        //     // keycloak returns 'account' & 'realm-management' client by default
        //     .filter(tenantClient => tenantClient[0] !== 'account' && tenantClient[0] !== 'realm-management')
        //     .forEach(client => (filteredResourceAccess = {...filteredResourceAccess, [client[0]]: client[1]}));
        // if there is no peristed default tenant in redux, move on to 2-3
        if (isEmpty(persistedSelectedTenant)) {
            // get the realm from URL
            const realm = getAuthConfig().realm;
            // check if realm(from URL) matches with any client from keycloak
            const tenantFromRealm = checkIfClientExistsInKeycloak(realm, filteredResourceAccess);
            // if realm does not match with any clients, set the first client as default tenant
            const defaultTenant = tenantFromRealm || Object.entries(filteredResourceAccess)[0];
            // construct the object and dispatch to redux
            const selectedTenant = {
                id: defaultTenant[0],
                roles: defaultTenant[1].roles,
            };
            dispatch(setSelectedTenantInfo(selectedTenant));
        } else {
            // check if persistedTenant exists in clients from keycloak
            const persistedTenantExistsInClients = checkIfClientExistsInKeycloak(
                persistedSelectedTenant,
                filteredResourceAccess
            );
            // if the client does not exist, assign the clients[0] as the default
            if (isEmpty(persistedTenantExistsInClients)) {
                const defaultClient = Object.entries(filteredResourceAccess)[0];
                // construct the object and dispatch to redux
                const defaultSelectedTenant = {
                    id: defaultClient[0],
                    roles: defaultClient[1].roles,
                };
                localStorage.setItem('selectedTenant', defaultClient[0]);
                dispatch(setSelectedTenantInfo(defaultSelectedTenant));
            }
            // if tenant exists in localStorage, but is not set in the REDUX
            else {
                dispatch(
                    setSelectedTenantInfo({
                        id: persistedTenantExistsInClients[0],
                        roles: persistedSelectedTenant[1].roles,
                    })
                );
            }
        }
    };

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

AuthProvider.defaultProps = {
    options: undefined,
    appOptions: undefined,
    addUser: undefined,
    getAppOptions: undefined,
    logoutUser: undefined,
    getSelectValues: undefined,
};

AuthProvider.propTypes = {
    options: PropTypes.any,
    appOptions: PropTypes.any,
    addUser: PropTypes.any,
    getAppOptions: PropTypes.any,
    logoutUser: PropTypes.any,
    getSelectValues: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthProvider);
