/**
 * Tranforms an array of tenant info into an object for convience use
 * @param {array} selectedTenant [0] - id, [1] - roles[]
 * @returns An transform object with expected properties
 */
export const transformSelectTenant = selectedTenant => {
    return {
        id: selectedTenant[0],
        roles: selectedTenant[1].roles,
    };
};

/**
 * Receives current username and the selected tenant and updates LocalStorage
 * @param currentLoggedInUsername Username of the logged in user
 * @param selectedTenant Selected Tenant from Keycloak Clients
 */
export const updateLocalStorageWithSelectedTenant = (currentLoggedInUsername, selectedTenant) => {
    // get all persisted information for all users from localStorage
    const existingPersistedSelectedTenant = JSON.parse(localStorage.getItem('persistedSelectedTenants'));
    // add the new user or overwrite existing user with new selected tenant
    const updatePersistedSelectedTenants = JSON.stringify({
        ...existingPersistedSelectedTenant,
        [currentLoggedInUsername]: selectedTenant,
    });
    localStorage.setItem('persistedSelectedTenants', updatePersistedSelectedTenants);
};
