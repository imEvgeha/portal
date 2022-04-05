import {MULTISELECT_SEARCHABLE_DATA_TYPES} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {isObjectEmpty, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {store} from '../../../../../index';
import {rightSearchHelper} from '../dashboard/RightSearchHelper';
import React from 'react';
import PropTypes from 'prop-types';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';

const PASS_THROUGH = ['availHistoryIds'];

class RightsURL extends React.Component {
    static instance = null;

    componentDidMount() {
        RightsURL.instance = this;
    }

    render() {
        return '';
    }

    static URLtoArray(url, matchParams = {}) {
        let toReturn = [];
        if (!isObjectEmpty(matchParams)) {
            Object.keys(matchParams).forEach(key => toReturn.push(key + '=' + matchParams[key]));
        }
        if (url) {
            const searchParams = url.substr(1).split('&');
            if (searchParams.length > 0) {
                toReturn = toReturn.concat(searchParams);
            }
        }

        return toReturn;
    }

    static ArraytoFilter(params) {
        const filter = {};
        let found = -1;
        const rootStore = store.getState().root;
        const mappings = rootStore.availsMapping.mappings;
        const selectValues = rootStore.selectValues;

        params.forEach(param => {
            const vals = param.split('=');
            if (vals.length === 2) {
                let name = vals[0];
                const val = decodeURIComponent(vals[1]);
                if (!PASS_THROUGH.includes(name)) {
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
                        if (
                            map &&
                            ![
                                DATETIME_FIELDS.TIMESTAMP,
                                DATETIME_FIELDS.BUSINESS_DATETIME,
                                DATETIME_FIELDS.REGIONAL_MIDNIGHT,
                                'duration',
                            ].includes(map.dataType)
                        )
                            map = null;
                    }
                    if (map) {
                        if (!filter[name]) found++;
                        if (!subkey) {
                            const multiSelectSearchDataType = MULTISELECT_SEARCHABLE_DATA_TYPES.includes(
                                map.searchDataType
                            );
                            if (multiSelectSearchDataType) {
                                let vals = val.split(',');
                                let allOptions;
                                if (multiSelectSearchDataType) {
                                    allOptions = vals.map(val => {
                                        return {value: val};
                                    });
                                } else {
                                    allOptions = selectValues[map.javaVariableName];
                                }
                                if (allOptions) {
                                    allOptions.map(rec => (rec.label = rec.value));
                                    vals = vals.map(opt => allOptions.find(rec => rec.value === opt)).filter(v => v);
                                    if (vals.length > 0) {
                                        filter[name] = {name: name, order: found, options: vals};
                                    }
                                } else {
                                    console.error('OPTIONS NOT LOADED FOR: ', map.javaVariableName);
                                }
                            } else {
                                filter[name] = {name: name, order: found, value: val};
                            }
                        } else {
                            filter[name] = filter[name] || {name: name, order: found};
                            filter[name][subkey] = val;
                        }
                    }
                } else {
                    found++;
                    filter[name] = {name: name, order: found, value: val};
                }
            }
        });
        return filter;
    }

    static isAdvancedFilter(url) {
        if (!url) return false;
        const params = url.substring(1).split('&');
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

    static FilterToObj(filter) {
        return rightSearchHelper.prepareAdvancedSearchCall(filter);
    }

    static saveRightsSimpleFilterUrl(filter) {
        const params = [];
        if (filter.text) {
            params.push('text=' + encodeURIComponent(filter.text));
        }
        const search = params.join('&');
        this.saveURL(URL.keepEmbedded('/avails/rights' + (search ? '?' + search : '')));
    }

    static saveRightsAdvancedFilterUrl(filter) {
        const searchParams = this.FilterToObj(filter);
        let availHistoryIds = null;
        const finalParams = {};
        Object.keys(searchParams).forEach(key => {
            const val = searchParams[key];
            if (PASS_THROUGH.includes(key)) {
                if (key === 'availHistoryIds') availHistoryIds = val;
            } else {
                finalParams[key] = val;
            }
        });

        let toReturn = '/avails';
        if (availHistoryIds) {
            toReturn += '/history/' + availHistoryIds;
        } else {
            toReturn += '/rights';
        }

        const params = [];
        Object.keys(finalParams).forEach(key => {
            params.push(key + '=' + encodeURIComponent(finalParams[key]));
        });

        const search = params.join('&');
        this.saveURL(URL.keepEmbedded(toReturn + (search ? '?' + search : '')));
    }

    static saveURL(url) {
        if (RightsURL.instance) {
            RightsURL.instance.context.router.navigate(url);
        }
    }

    static get matchParam() {
        if (!RightsURL.instance) {
            return '';
        }
        return RightsURL.instance.context.router.route.match.params;
    }

    static getFatalsRightsSearchUrl(availHistoryIds) {
        return URL.keepEmbedded(this.createRightsSearchUrl(availHistoryIds, null, true));
    }

    static createRightsSearchUrl(availHistoryIds, status = null, isManualRightsEntry = false) {
        let toReturn = '/avails';
        if (availHistoryIds) {
            toReturn += '/history/' + availHistoryIds;
            if (status !== null) {
                toReturn += `?status=${status}`;
            }
            if (isManualRightsEntry) {
                toReturn += `/manual-rights-entry`;
            }
        } else {
            toReturn += '/rights';
        }
        return toReturn;
    }

    static getRightUrl(id, nav) {
        const availHistoryIds = this.matchParam.availHistoryIds;
        const initialSearch = URL.search();
        let search;

        if (availHistoryIds) {
            search = 'availHistoryIds=' + availHistoryIds;
        }

        if (nav && nav.back) {
            if (search) {
                search = search + '&back=' + nav.back;
            } else {
                search = 'back=' + nav.back;
            }

            const searchP = Object.keys(nav.params)
                .map(key => key + '=' + nav.params[key])
                .join('&');

            if (searchP) {
                search = search + '&' + searchP;
            }
        }

        if (search) {
            if (initialSearch) {
                search = initialSearch + '&' + search;
            } else {
                search = '?' + search;
            }
        } else {
            search = initialSearch;
        }

        return URL.keepEmbedded('/avails/rights/' + id + search);
    }

    static getSearchURLFromRightUrl(path, search) {
        const beforeID = path.substr(0, path.lastIndexOf('/'));
        return beforeID + search;
    }

    static get search() {
        let url = window.location.pathname;
        const searchP = window.location.search;
        const params = [];
        if (!url.startsWith('/avails')) return URL.keepEmbedded(searchP);
        url = url.replace('/avails', '');
        if (url.startsWith('/history')) {
            url = url.replace('/history', '');
            if (url.startsWith('/')) {
                const val = url.split('/')[1];
                params.push('availHistoryIds=' + val);
                url = url.replace('/' + val, '');
            }
        }
        if (params.length > 0) {
            return URL.keepEmbedded(searchP + '&' + params.join('&'));
        } else {
            return URL.keepEmbedded(searchP);
        }
    }
}

RightsURL.contextTypes = {
    router: PropTypes.object,
};
export const search = RightsURL.search;

export default RightsURL;
