import Http from '../../util/Http';
import config from 'react-global-configuration';
import store from '../../stores';
import {loadReports, setReportName} from '../../actions';
import {errorModal} from '../../components/share/ErrorModal';
import {advancedSearchHelper} from './AdvancedSearchHelper';
import {resultPageUpdateColumnsOrder} from '../../actions/dashboard';


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


const http = Http.create({noDefaultErrorHandling: false});


const loadReportToStore = (report) => {
    store.dispatch(setReportName(report.name));
    store.dispatch(resultPageUpdateColumnsOrder(report.columns));
    advancedSearchHelper.loadAdvancedSearchForm(report.filter ? report.filter : {});
    advancedSearchHelper.advancedSearch(report.filter ? report.filter : {});
};

const readReportFromStore = () => {
    const report = {
        name: store.getState().dashboard.reportName,
        filter: store.getState().dashboard.advancedSearchCriteria,
        columns: store.getState().dashboard.columns,
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

const loadConfiguration = (configuration) => {
    if (configuration && configuration.avails && configuration.avails.reports){
        store.dispatch(loadReports(configuration.avails.reports));
    } else {
        store.dispatch(loadReports([]));
        console.warn('No reports in configuration, init empty list');
    }
};

export const configurationService = {
    initConfiguration: (forceReload) => {
        if (forceReload || !store.getState().root.reports) {
            getConfiguration().then( (response) => {
                loadConfiguration(response.data);
            }). catch((error) => {
                errorModal.open('Error', () => {}, {description: 'System is not configured correctly!', closable: false});
                console.error('Unable to load configuration');
                console.error(error);
            });
        }
    },


    getReportsNames: () => {
        if (!store.getState().root.reports) {
            return [];
        }
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
        putConfiguration({'avails': {'reports': reports}}).then( (response) => {
            loadConfiguration(response.data);
            store.dispatch(setReportName(reportName));
        }). catch((error) => {  
            //errorModal.open('Error', () => {}, { description: 'System is not configured correctly!', closable: false });
            console.error('Unable to Save Report');
            console.error(error);
        });
    },
    deleteReport: (reportName) => {
        const reports = store.getState().root.reports.filter((report) => {return report.name !== reportName;});
        putConfiguration({'avails': {'reports': reports}}).then( (response) => {
            loadConfiguration(response.data);
            store.dispatch(setReportName(''));
        }). catch((error) => {
            console.error('Unable to Delete Report');
            console.error(error);
        });
    }

};