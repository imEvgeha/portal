import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {store} from '../../../../../index';
import {loadReports, setReportName} from '../../../stores/actions/index';
import {errorModal} from '../../../components/modal/ErrorModal';
import {rightSearchHelper} from '../dashboard/RightSearchHelper';
import {resultPageSort, resultPageUpdateColumnsOrder} from '../../../stores/actions/avail/dashboard';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';

const loadReportToStore = report => {
    store.dispatch(setReportName(report.name));
    store.dispatch(resultPageUpdateColumnsOrder(report.columns));

    const sortedBy = [];
    if (report.sortedBy) {
        report.sortedBy.forEach(entry => {
            sortedBy.push({id: entry.column, desc: entry.order === 'DESC'});
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

    if (originalSort) {
        originalSort.forEach(entry => {
            sortedBy.push({column: entry.id, order: entry.desc ? 'DESC' : 'ASC'});
        });
    }

    return {
        name: store.getState().dashboard.session.reportName,
        orderedFilter: store.getState().dashboard.session.advancedSearchCriteria,
        columns: store.getState().dashboard.session.columns,
        sortedBy: sortedBy,
    };
};

const getConfiguration = () => {
    const uri = `/configuration`;
    const url = getApiURI('configuration', uri);

    return nexusFetch(url, {isWithErrorHandling: false});
};

const putConfiguration = configuration => {
    const uri = `/configuration`;
    const url = getApiURI('configuration', uri);

    return nexusFetch(url, {
        method: 'put',
        body: JSON.stringify(configuration),
    });
};

const loadConfiguration = configuration => {
    if (configuration && configuration.avails && configuration.avails.reports) {
        store.dispatch(loadReports(configuration.avails.reports));
    } else {
        store.dispatch(loadReports([]));
        // eslint-disable-next-line
        console.warn('No reports in configuration, init empty list');
    }
};

export const configurationService = {
    getConfiguration,

    initConfiguration: forceReload => {
        if (forceReload || !store.getState().root.reports) {
            getConfiguration()
                .then(response => {
                    loadConfiguration(response);
                })
                .catch(error => {
                    errorModal.open('Error', () => {}, {
                        description: 'System is not configured correctly!',
                        closable: false,
                    });
                    console.error('Unable to load configuration');
                    console.error(error);
                });
        }
    },

    getReportsNames: () => {
        if (!store.getState().root.reports) {
            return [];
        }
        return store.getState().root.reports.map(report => report.name);
    },

    changeReport: reportName => {
        if (reportName) {
            const reports = store.getState().root.reports;
            const report = reports.find(report => {
                return report.name === reportName;
            });
            if (report) {
                loadReportToStore(report);
            } else {
                errorModal.open('Cannot find report: ' + reportName);
            }
        } else {
            resetToNoReport();
        }
    },

    saveReport: reportName => {
        const reports = store.getState().root.reports;
        const newReport = readReportFromStore();

        const currentReport = reports.find(report => {
            return report.name === reportName;
        });
        if (currentReport) {
            currentReport.orderedFilter = newReport.orderedFilter;
            currentReport.columns = newReport.columns;
            currentReport.sortedBy = newReport.sortedBy;
        } else {
            newReport.name = reportName;
            reports.push(newReport);
        }
        putConfiguration({avails: {reports: reports}})
            .then(response => {
                loadConfiguration(response);
                store.dispatch(setReportName(reportName));
            })
            .catch(error => {
                console.error('Unable to Save Report');
                console.error(error);
            });
    },

    deleteReport: reportName => {
        const reports = store.getState().root.reports.filter(report => {
            return report.name !== reportName;
        });
        putConfiguration({avails: {reports: reports}})
            .then(response => {
                loadConfiguration(response);
                configurationService.changeReport('');
            })
            .catch(error => {
                console.error('Unable to Delete Report');
                console.error(error);
            });
    },
};
