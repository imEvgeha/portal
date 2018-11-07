import Http from '../../util/Http';
import config from 'react-global-configuration';
import store from '../../stores';
import {loadReports, setReportName} from '../../actions';
import {errorModal} from '../../components/share/ErrorModal';
import {advancedSearchHelper} from './AdvancedSearchHelper';


// const mockedConfiguration = {
//     'avails': {
//         'reports': [
//             {
//                 'name': 'Batman report 1',
//                 'filter': {
//                     'title': 'Batman',
//                     'studio': 'Warner'
//                 },
//                 'columns': [
//                     'title',
//                     'studio',
//                     'vodStart',
//                     'vodEnd'
//                 ],
//                 'sortedBy': [
//                     {
//                         'column': 'title',
//                         'order': 'ASC'
//                     },
//                     {
//                         'column': 'vodEnd',
//                         'order': 'DESC'
//                     }
//                 ]
//             },
//             {
//                 'name': 'Batman report 2',
//                 'filter': {
//                     'rowInvalid': true
//                 },
//                 'columns': [
//                     'vodStart',
//                     'title'
//                 ]
//             }
//         ]
//     }
// };


const http = Http.create();


const loadReportToStore = (report) => {
    console.log(report);
    store.dispatch(setReportName(report.name));
    advancedSearchHelper.loadAdvancedSearchForm(report.filter ? report.filter : {});
    advancedSearchHelper.advancedSearch(report.filter ? report.filter : {});
};

const readReportFromStore = () => {
    const report = {
        name: store.getState().session.reportName,
        filter: store.getState().dashboard.searchCriteria
    };
    return report;
};

const getConfiguration = () => {
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') +'/configuration');
    // return new Promise(function(resolve) {
    //     setTimeout(function() {
    //         resolve({data: mockedConfiguration});
    //     }, 300);
    // });
};

const putConfiguration = (configuration) => {
    return http.put(config.get('gateway.configuration') + config.get('gateway.service.configuration') +'/configuration', configuration);
};

export const configurationService = {
    initConfiguration: (forceReload) => {
        if (forceReload || !store.getState().root.reports) {
            getConfiguration().then( (response) => {
                if (response.data && response.data.avails && response.data.avails.reports){
                    store.dispatch(loadReports(response.data.avails.reports));
                } else {
                    store.dispatch(loadReports([]));
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
        const reports = store.getState().root.reports;
        // const reports = [];
        const newReport = readReportFromStore();

        const currentReport = reports.find((report) => {return report.name === reportName;});
        if (currentReport) {
            currentReport.filter = newReport.filter;
            currentReport.columns = newReport.columns;
            currentReport.sortedBy = newReport.sortedBy;
        } else {
            newReport.name = reportName;
            reports.push(newReport);
        }
        putConfiguration({'avails': {'reports': reports}});
    },

    deleteReport: (reportName) => {
        const reports = store.getState().root.reports.filter((report) => {return report.name !== reportName;});
        putConfiguration({'avails': {'reports': reports}});
    }

};