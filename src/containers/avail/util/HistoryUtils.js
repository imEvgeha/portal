import React from 'react';
import t from 'prop-types';
import {advancedHistorySearchHelper} from '../ingest-history/AdvancedHistorySearchHelper';

class HistoryURL extends React.Component {
    static instance = null;

    static contextTypes = {
        router: t.object
    }

    componentDidMount() {
        HistoryURL.instance = this;
    }

    render(){
        return('');
    }

    static URLtoArray(url){
        let toReturn = [];
        if(url){
            const searchParams = url.substr(1).split('&');
            toReturn = searchParams;
        }

        return toReturn;
    }

    static ArraytoFilter(params){
        const options={
            status: ['PENDING', 'COMPLETED', 'FAILED'],
            ingestType: ['Email', 'Upload']
        };

        const filter = {ingestType : ''};

        params.forEach(param => {
            const vals = param.split('=');
            if(vals.length === 2){
                let name = vals[0];
                const val = vals[1];
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
                    case 'provider':
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

    static FilterToObj(filter){
        return advancedHistorySearchHelper.prepareAdvancedHistorySearchCall(filter);
    }

    static saveHistoryAdvancedFilterUrl(filter){
        const searchParams = this.FilterToObj(filter);

        let toReturn = '/avails/history';

        const params = [];
        Object.keys(searchParams).forEach(key => {
            if(searchParams[key]) {
                params.push(key + '=' + searchParams[key]);
            }
        });

        const search = params.join('&');
        this.saveURL(toReturn + '?' + search);
    }

    static saveURL(url){
        if(HistoryURL.instance) {
            HistoryURL.instance.context.router.history.push(url);
        }
    }
}

export default HistoryURL;