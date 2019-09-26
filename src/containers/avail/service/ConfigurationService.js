import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {store} from '../../../index';
import {loadReports, setReportName} from '../../../stores/actions/index';
import {errorModal} from '../../../components/modal/ErrorModal';
import {rightSearchHelper} from '../dashboard/RightSearchHelper';
import {resultPageUpdateColumnsOrder, resultPageSort} from '../../../stores/actions/avail/dashboard';

const httpWithoutErrorHandling = Http.create({noDefaultErrorHandling: false});
const http = Http.create();


const loadReportToStore = (report) => {
    store.dispatch(setReportName(report.name));
    store.dispatch(resultPageUpdateColumnsOrder(report.columns));

    const sortedBy = [];
    if(report.sortedBy){
        report.sortedBy.forEach((entry) => {
            sortedBy.push({id : entry.column, desc : entry.order === 'DESC' ? true : false});
        });
    }

    store.dispatch(resultPageSort(sortedBy));
    rightSearchHelper.loadAdvancedSearchForm(report.orderedFilter ? report.orderedFilter : {});
    rightSearchHelper.advancedSearch(report.orderedFilter ? report.orderedFilter : {});
};

const resetToNoReport = () => {
    store.dispatch(setReportName(''));
    store.dispatch(resultPageUpdateColumnsOrder());
    store.dispatch(resultPageSort([]));
    rightSearchHelper.loadAdvancedSearchForm({});
    rightSearchHelper.advancedSearch({});
};

const readReportFromStore = () => {
    const originalSort = store.getState().dashboard.session.availTabPageSort;
    const sortedBy = [];

    if(originalSort){
        originalSort.forEach((entry) => {
            sortedBy.push({column : entry.id, order : entry.desc ? 'DESC' : 'ASC'});
        });
    }

    const report = {
        name: store.getState().dashboard.session.reportName,
        orderedFilter: store.getState().dashboard.session.advancedSearchCriteria,
        columns: store.getState().dashboard.session.columns,
        sortedBy: sortedBy
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
    getConfiguration,
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
        if(reportName){
            const reports = store.getState().root.reports;
            const report = reports.find((report) => {
               return report.name === reportName;
            });
            if (report) {
                loadReportToStore(report);
            } else {
                errorModal.open('Cannot find report: ' + reportName);
            }
        }else{
            resetToNoReport();
        }
    },

    saveReport: (reportName) => {
        const reports = store.getState().root.reports;
        const newReport = readReportFromStore();

        //TEMPORARY WORKAROUND to prevent ACCOUNT CRASHING: exclude 'complex'fields from saved filters
        const allFilters = newReport.orderedFilter;
        if(allFilters) {
            newReport.orderedFilter = {};
            for (let [key, value] of Object.entries(allFilters)) {
                if(!value.hasOwnProperty('options')){
                    newReport.orderedFilter[key] = value;
                }
            }
        }
        //END of TEMPORARY WORKAROUND

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
            configurationService.changeReport('');
        }). catch((error) => {
            console.error('Unable to Delete Report');
            console.error(error);
        });
    }

};
