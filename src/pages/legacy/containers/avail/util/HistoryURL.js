import React from 'react';
import PropTypes from 'prop-types';
import {advancedHistorySearchHelper} from '../ingest-history/AdvancedHistorySearchHelper';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';

class HistoryURL extends React.Component {
    static instance = null;

    componentDidMount() {
        HistoryURL.instance = this;
    }

    render() {
        return '';
    }

    static URLtoArray(url) {
        let toReturn = [];
        if (url) {
            const searchParams = url.substr(1).split('&');
            toReturn = searchParams;
        }

        return toReturn;
    }

    static ArraytoFilter(params) {
        const options = {
            status: ['PENDING', 'COMPLETED', 'FAILED', 'MANUAL'],
            ingestType: ['Email', 'Upload'],
        };

        const filter = {ingestType: ''};

        params.forEach(param => {
            const vals = param.split('=');
            if (vals.length === 2) {
                let name = vals[0];
                const val = decodeURIComponent(vals[1]);
                let subkey = name;

                if (name.endsWith('From')) {
                    subkey = 'from';
                    name = name.substring(0, name.length - 4);
                }
                if (name.endsWith('To')) {
                    subkey = 'to';
                    name = name.substring(0, name.length - 2);
                }
                switch (name) {
                    case 'licensor':
                        filter[name] = val;
                        break;
                    case 'received':
                        filter[name] = filter[name] || {};
                        filter[name][subkey] = val;
                        break;
                    case 'status':
                    case 'ingestType':
                        filter[name] = options[name].includes(val) ? val : '';
                }
            }
        });
        return filter;
    }

    static FilterToObj(filter) {
        return advancedHistorySearchHelper.prepareAdvancedHistorySearchCall(filter);
    }

    static saveHistoryAdvancedFilterUrl(filter) {
        const searchParams = this.FilterToObj(filter);

        const toReturn = '/avails/history';

        const params = [];
        Object.keys(searchParams).forEach(key => {
            if (searchParams[key]) {
                params.push(key + '=' + encodeURIComponent(searchParams[key]));
            }
        });

        const search = params.join('&');
        this.saveURL(URL.keepEmbedded(toReturn + (search ? '?' + search : '')));
    }

    static saveURL(url) {
        if (HistoryURL.instance) {
            HistoryURL.instance.context.router.history.push(url);
        }
    }
}

HistoryURL.contextTypes = {
    router: PropTypes.object,
};

export default HistoryURL;
