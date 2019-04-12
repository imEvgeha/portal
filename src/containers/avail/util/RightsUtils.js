import {isObjectEmpty} from '../../../util/Common';
import store from '../../../stores/index';
import {URL} from '../../../util/Common';
import {rightSearchHelper} from '../dashboard/RightSearchHelper';
import React from 'react';
import t from 'prop-types';

const PASS_THROUGH = ['availHistoryIds', 'invalid'];

class RightsURL extends React.Component {

    static instance = null;

    static contextTypes = {
        router: t.object
    }

    componentDidMount() {
        RightsURL.instance = this;
    }

    render(){
        return('');
    }

    static URLtoArray(url, matchParams={}){
        let toReturn = [];
        if(!isObjectEmpty(matchParams)){
            Object.keys(matchParams).forEach(key => {
                let value = matchParams[key];
                if(key === 'valid'){
                    toReturn.push('invalid=' + (value === 'errors'));
                }else{
                    toReturn.push(key + '=' + value);
                }
            });
        }
        if(url){
            const searchParams = url.substr(1).split('&');
            if(searchParams.length > 0){
                toReturn = toReturn.concat(searchParams);
            }
        }

        return toReturn;
    }

    static ArraytoFilter(params){
        const filter = {};
        let found = -1;
        const rootStore = store.getState().root;
        const mappings = rootStore.availsMapping.mappings;
        const selectValues = rootStore.selectValues;

        params.forEach(param => {
            const vals = param.split('=');
            if(vals.length === 2){
                let name = vals[0];
                const val = vals[1];
                if(!PASS_THROUGH.includes(name)) {
                    let subkey = null;
                    let map = mappings.find(({queryParamName}) => queryParamName === name);
                    if (!map && name.endsWith('From')) {
                        subkey = 'from';
                        name = name.substring(0, name.length - 4);
                    }
                    if (!map && name.endsWith('To')) {
                        subkey = 'to';
                        name = name.substring(0, name.length - 2);
                    }
                    if (subkey) {
                        map = mappings.find(({queryParamName}) => queryParamName === name);
                        if (map && ['date', 'localdate', 'duration'].includes(map.dataType)) map = null;
                    }
                    if (map) {
                        if (!filter[name]) found++;
                        if (!subkey) {
                            if (map.searchDataType === 'multiselect' || map.searchDataType === 'multilanguage') {
                                let vals = val.split(',');
                                let allOptions;
                                if(map.searchDataType === 'multiselect') {
                                    allOptions = vals.map(val => {
                                        return {value: val};
                                    });
                                }else{
                                    allOptions = selectValues[map.javaVariableName];
                                }
                                if (allOptions) {
                                    allOptions.map((rec) => rec.label = rec.value);
                                    vals = vals.map((opt) => allOptions.find((rec) => rec.value === opt)).filter((v) => v);
                                    if (vals.length > 0) {
                                        filter[name] = {name: name, order: found, options: vals};
                                    }
                                }else{
                                    console.error('OPTIONS NOT LOADED FOR: ',map.javaVariableName);
                                }
                            } else {
                                filter[name] = {name: name, order: found, value: val};
                            }
                        } else {
                            filter[name] = filter[name] || {name: name, order: found};
                            filter[name][subkey] = val;
                        }
                    }
                }else{
                    found++;
                    filter[name] = {name: name, order: found, value: val};
                }
            }
        });
        return filter;
    }

    static isAdvancedFilter(url) {
        if(!url) return false;
        let params = url.substring(1).split('&');
        let isAdvanced = false;
        params.forEach(param => {
            const field = param.split('=')[0];
            if (field !== 'embedded' && field !== 'text') {
                isAdvanced = true;
                return true;
            }
        });
        return isAdvanced;
    }


    static FilterToObj(filter){
        return rightSearchHelper.prepareAdvancedSearchCall(filter);
    }

    static saveRightsSimpleFilterUrl(filter){
        const params = [];
        if(filter.text){
            params.push('text=' + filter.text);
        }
        const search = params.join('&');
        this.saveURL('/avails/rights' + (search ? '?' + search : ''));
    }

    static saveRightsAdvancedFilterUrl(filter){
        const searchParams = this.FilterToObj(filter);
        let availHistoryIds = null;
        let invalid = null;
        const finalParams = {};
        Object.keys(searchParams).forEach(key => {
            const val = searchParams[key];
            if(PASS_THROUGH.includes(key)){
                if(key === 'availHistoryIds') availHistoryIds = val;
                if(key === 'invalid') invalid = (val === 'true');
            }else{
                finalParams[key] = val;
            }
        });


        let toReturn = '/avails';
        if(availHistoryIds){
            toReturn += '/history/' + availHistoryIds;
            if(invalid === true){
                toReturn+='/errors';
            }else if(invalid === false){
                finalParams.invalid = false;
            }
        }else{
            toReturn += '/rights';
            if(invalid !== null){
                finalParams.invalid = invalid;
            }
        }

        const params = [];
        Object.keys(finalParams).forEach(key => {
            params.push(key + '=' + finalParams[key]);
        });

        const search = params.join('&');
        this.saveURL(toReturn + '?' + search);

    }

    static saveURL(url){
        if(RightsURL.instance) {
            RightsURL.instance.context.router.history.push(url);
        }
    }

    static get matchParam(){
        if(!RightsURL.instance) {
            return '';
        }
        return RightsURL.instance.context.router.route.match.params;
    }

    static getRightsSearchUrl(availHistoryIds, invalid = null){
        let search = '';
        let pathname = '/avails';
        if(availHistoryIds){
            pathname+='/history/' + availHistoryIds;
            if(invalid === true){
                pathname += '/errors';
            }
            if(invalid === false){
                search += '?invalid=false';
            }
        }else{
            pathname += '/rights';
            if(invalid !== null){
                search += '?invalid=' + invalid;
            }
        }
        return {pathname:pathname, search:search};
    }

    static getRightUrl(id){
        const availHistoryIds = this.matchParam.availHistoryIds;
        const valid = this.matchParam.valid;
        const initialSearch = URL.search();
        let search;

        if(availHistoryIds){
            search = 'availHistoryIds=' + availHistoryIds;
            if(valid && valid === 'errors'){
                search += '&invalid=true';
            }
        }

        if(search){
            if(initialSearch){
                search = initialSearch + '&' + search;
            }else{
                search = '?' + search;
            }
        }else{
            search = initialSearch;
        }

        return '/avails/rights/' + id + search;
    }

    static getSearchURLFromRightUrl(path, search){
        const beforeID = path.substr(0, path.lastIndexOf('/'));
        return beforeID + search;
    }

    static get availsDashboardUrl(){
        return '/avails';
    }
}

export default RightsURL;