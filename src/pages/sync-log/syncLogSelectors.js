import {createSelector} from 'reselect';

export const selectSyncLog = state => state.syncLog;
export const selectSyncLogDateFrom = createSelector(selectSyncLog, syncLog => syncLog.dateFrom);
export const selectSyncLogDateTo = createSelector(selectSyncLog, syncLog => syncLog.dateTo);
