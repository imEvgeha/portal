const NO_CONTENT = 204;

export default async (response) => {
    try {
        const contentType = getResponseContentType(response);
        if (response.ok) {
            if (response.status === NO_CONTENT) {
                return '';
            }
            // BE issue: empty response headers workaround
            if (!contentType) {
                return response.body;
            }
            const responseBody = await parseResponse(response, contentType);
            return responseBody;
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
        // configuration/endpoint return text/plain content type as header response -> header request is application/json
        return response.json();
    } else if (type.includes('text/html')) {
        return response.text();
    } else if (type.includes('multipart/form-data')) {
        return response.formData();
    } else if (type.includes('application/octet-stream')) { 
        return response.arrayBuffer();
    }

    throw {errorMessage: `Nexus fetch does not support content-type ${type} yet`};
};
