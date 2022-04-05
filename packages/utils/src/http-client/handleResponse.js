/* eslint-disable no-magic-numbers, no-throw-literal */

export default async (response, fetchHeaders) => {
    try {
        const contentType = getResponseContentType(response);
        if (response.ok) {
            if (response.status === 204) {
                return '';
            }

            // BE issue: empty response headers workaround
            if (!contentType) {
                return fetchHeaders ? [response.body, response.headers] : response.body;
            }

            const responseBody = await parseResponse(response, contentType);

            return fetchHeaders ? [responseBody, response.headers] : responseBody;
        }

        let errorBody = '';
        // BE issue: empty response headers workaround
        if (!contentType) {
            errorBody = response.body;
        }
        errorBody = await parseResponse(response, contentType);
        throw {errorMessage: errorBody, status: response.status, statusText: response.statusText, name: response.name};
    } catch (error) {
        throw error;
    }
};

const getResponseContentType = response => {
    const {headers = {}} = response || {};
    const type = headers && headers.get('content-type');
    return type;
};

const parseResponse = (response, type) => {
    // types
    if (type.includes('application/json')) {
        return response.json();
    } else if (type.includes('text/plain')) {
        // configuration/endpoint return text/plain content type as header response
        // -> header request is application/json
        return response.json();
    } else if (type.includes('text/html') || type.includes('text/csv')) {
        return response.text();
    } else if (type.includes('multipart/form-data')) {
        return response.formData();
    } else if (type.includes('application/vnd.ms-excel')) {
        return response.blob();
    } else if (type.includes('application/octet-stream')) {
        return response.arrayBuffer();
    }

    throw {errorMessage: `Nexus fetch does not support content-type ${type} yet`};
};
