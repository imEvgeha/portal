import fetchIntercept from 'fetch-intercept';

export const registerFetchInterceptor = selectedTenant =>
    fetchIntercept.register({
        request(url, config) {
            // intercept the call and add the selected tenant from UI into the headers
            config.headers = {tenantCode: selectedTenant.id, ...config.headers};
            return [url, config];
        },

        requestError(error) {
            // Called when an error occured during another 'request' interceptor call
            return Promise.reject(error);
        },

        response(response) {
            // Modify the reponse object
            return response;
        },

        responseError(error) {
            // Handle an fetch error
            return Promise.reject(error);
        },
    });
