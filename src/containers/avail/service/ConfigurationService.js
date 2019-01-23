import Http from '../../../util/Http';
import config from 'react-global-configuration';
import store from '../../../stores/index';
import {loadReports, setReportName} from '../../../stores/actions/index';
import {errorModal} from '../../../components/modal/ErrorModal';
import {availSearchHelper} from '../dashboard/AvailSearchHelper';
import {resultPageUpdateColumnsOrder} from '../../../stores/actions/avail/dashboard';

const httpWithoutErrorHandling = Http.create({noDefaultErrorHandling: false});
const http = Http.create();


const loadReportToStore = (report) => {
    store.dispatch(setReportName(report.name));
    store.dispatch(resultPageUpdateColumnsOrder(report.columns));
    availSearchHelper.loadAdvancedSearchForm(report.orderedFilter ? report.orderedFilter : {});
    availSearchHelper.advancedSearch(report.orderedFilter ? report.orderedFilter : {});
};

const readReportFromStore = () => {
    const report = {
        name: store.getState().dashboard.session.reportName,
        orderedFilter: store.getState().dashboard.session.advancedSearchCriteria,
        columns: store.getState().dashboard.session.columns,
    };
    return report;
};

const getConfiguration = () => {
    return httpWithoutErrorHandling.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') +'/configuration');
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
        const newReport = readReportFromStore();

        const currentReport = reports.find((report) => {return report.name === reportName;});
        if (currentReport) {
            currentReport.orderedFilter = newReport.orderedFilter;
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