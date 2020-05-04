export default async (response) => {
    try {
        const responseBody = await parseResponse(response);
        if (response.ok) {
            return responseBody;
        } 
        throw {errorMessage: responseBody, status: response.status, statusText: response.statusText, name: response.name};
    } catch (error) {
        throw error;
    }
};

const parseResponse = response => {
    const {headers} = response || {};
    const type = headers.get('content-type');

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

    throw new Error(`Nexus fetch does not support content-type ${type} yet`);
};
