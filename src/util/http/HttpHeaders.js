export const HeadersEnum = {
    IF_UNMODIFIED_SINCE: 'If-Unmodified-Since',
};

export default class HttpHeaders {
    #headerMapping = {
        'last-modified': 'If-Unmodified-Since',
    };

    #headers = {};

    get headers() {
        return this.#headers;
    }

    set headers(headers) {
        const keys = headers.keys();
        let header = keys.next();
        while (header.value) {
            const headerKey = this.#headerMapping?.[header.value] || header.value;
            this.#headers = {...this.#headers, [headerKey]: headers.get(header.value)};
            header = keys.next();
        }
    }

    set header(headerKeyValue) {
        if (headerKeyValue.key && headerKeyValue.value) {
            this.#headers = {...this.#headers, [headerKeyValue.key]: headerKeyValue.value};
        } else {
            // eslint-disable-next-line no-console
            console.error(
                "set header used incorrectly.. Please provide an object with key value.. E.g.: {key:accept, value: '*/*'}"
            );
        }
    }
}
