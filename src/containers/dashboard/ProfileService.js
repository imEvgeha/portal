import Http from '../../util/Http';
import config from 'react-global-configuration';
import store from '../../stores';
import {loadAvailsMapping, loadReports, setReportName} from '../../actions';
import {searchFormUpdateSearchCriteria} from '../../actions/dashboard';
import {errorModal} from '../../components/share/ErrorModal';
import {dashboardService} from './DashboardService';
import {advancedSearchHelper} from './AdvancedSearchHelper';


const mockedResponeAvailsMapping = {
    'mappings': [
        {
            'sheetColumnName': 'Studio',
            'displayName': 'Studio',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'studio'
        },
        {
            'sheetColumnName': 'Title',
            'displayName': 'Title',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'title'
        },
        {
            'sheetColumnName': 'Release Year',
            'displayName': 'Release Year',
            'dataType': 'year',
            'fullTextSearch': 'no',
            'javaVariableName': 'releaseYear'
        },
        {
            'sheetColumnName': 'Type',
            'displayName': 'Type',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'type'
        },
        {
            'sheetColumnName': 'Release Type',
            'displayName': 'Release Type',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'releaseType'
        },
        {
            'sheetColumnName': 'Licensor',
            'displayName': 'Licensor',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'licensor'
        },
        {
            'sheetColumnName': 'Territory',
            'displayName': 'Territory',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'territory'
        },
        {
            'sheetColumnName': 'Rating',
            'displayName': 'Rating',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'rating'
        },
        {
            'sheetColumnName': 'Genre(s)',
            'displayName': 'Genre(s)',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'genres'
        },
        {
            'sheetColumnName': 'SD',
            'displayName': 'SD',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'sd'
        },
        {
            'sheetColumnName': 'HD',
            'displayName': 'HD',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'hd'
        },
        {
            'sheetColumnName': '3D',
            'displayName': '3D',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'f3d'
        },
        {
            'sheetColumnName': '4K/UHD',
            'displayName': '4K/UHD',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'f4k'
        },
        {
            'sheetColumnName': 'DBO',
            'displayName': 'DBO',
            'dataType': 'money',
            'fullTextSearch': 'no',
            'javaVariableName': 'dbo'
        },
        {
            'sheetColumnName': 'Theatrical Release',
            'displayName': 'Theatrical Release',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'theatricalRelease'
        },
        {
            'sheetColumnName': 'PO Start',
            'displayName': 'PO Start',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'poStart'
        },
        {
            'sheetColumnName': 'Hotel Start',
            'displayName': 'Hotel Start',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'hotelStart'
        },
        {
            'sheetColumnName': 'Hotel End',
            'displayName': 'Hotel End',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'hotelEnd'
        },
        {
            'sheetColumnName': 'EST Start',
            'displayName': 'EST Start',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'estStart'
        },
        {
            'sheetColumnName': 'EST End',
            'displayName': 'EST End',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'estEnd'
        },
        {
            'sheetColumnName': 'VOD Start',
            'displayName': 'VOD Start',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'vodStart'
        },
        {
            'sheetColumnName': 'VOD End',
            'displayName': 'VOD End',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'vodEnd'
        },
        {
            'sheetColumnName': 'HV/Physical',
            'displayName': 'HV/Physical',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'hvPhysical'
        },
        {
            'sheetColumnName': 'Foreign Language?',
            'displayName': 'Foreign Language?',
            'dataType': 'boolean',
            'fullTextSearch': 'no',
            'javaVariableName': 'foreignLanguage'
        }
    ]
};

const mockedConfiguration = {
    'avails': {
        'reports': [
            {
                'name': 'Batman report 1',
                'filter': {
                    'title': 'Batman',
                    'studio': 'Warner'
                },
                'columns': [
                    'title',
                    'studio',
                    'vodStart',
                    'vodEnd'
                ],
                'sortedBy': [
                    {
                        'column': 'title',
                        'order': 'ASC'
                    },
                    {
                        'column': 'vodEnd',
                        'order': 'DESC'
                    }
                ]
            },
            {
                'name': 'Batman report 2',
                'filter': {
                    'rowInvalid': true
                },
                'columns': [
                    'vodStart',
                    'title'
                ]
            }
        ]
    }
};


const http = Http.create();


const loadReportToStore = (report) => {
    console.log(report);
    store.dispatch(setReportName(report.name));
    advancedSearchHelper.loadAdvancedSearchForm(report.filter);
    advancedSearchHelper.advancedSearch(report.filter);
};

const readReportFromStore = () => {
    const report = {
        name: store.getState().session.reportName,
        filters: store.getState().dashboard.searchCriteria
    };
    return report;
};

const getReports = () => {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve({data: mockedConfiguration});
        }, 300);
    });
};

const getAvailsMapping = () => {
    return http.get(config.get('gateway.url') + config.get('base.path') +'/avails/mapping-data');
    // return new Promise(function(resolve, reject) {
    //     setTimeout(function() {
    //         resolve({data: mockedResponeAvailsMapping});
    //     }, 300);
    // });
};

export const profileService = {
    initAvailsMapping: (forceReload) => {
        if (forceReload || !store.getState().root.availsMapping) {
            getAvailsMapping().then( (response) => {
                store.dispatch(loadAvailsMapping(response.data));
            }). catch((error) => {
                console.error('Unable to load AvailsMapping');
                console.error(error);
            });
        }
    },

    initConfiguration: (forceReload) => {
        if (forceReload || !store.getState().root.reports) {
            getReports().then( (response) => {
                if (response.data && response.data.avails && response.data.avails.reports){
                    store.dispatch(loadReports(response.data.avails.reports));
                } else {
                    console.error('Unable to find reports in configuration');
                    console.error(response.data);
                }
            }). catch((error) => {
                console.error('Unable to load AvailsMapping');
                console.error(error);
            });
        }
    },


    getReportsNames: () => {
        return store.getState().root.reports.map((report) => (report.name));
    },

    changeReport: (reportName) => {
        const reports = store.getState().root.reports;
        const report = reports.find((report) => {
           return report.name === reportName;
        });
        if (report) {
            loadReportToStore(report);
        } else {
            errorModal.open('Cannot find report: ' + reportName);

        }
    },

    saveReport: (reportName) => {

    },

    deleteReport: (reportName) => {

    }

};