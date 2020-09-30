import {gotoAvailsDashboard} from '../../../ui/elements/nexus-navigation/NexusNavigation';
import {search} from '../containers/avail/util/RightsURL';

export const AVAILS_DASHBOARD = {
    name: 'Avails Dashboard',
    path: '/avails',
    search: search,
    onClick: () => gotoAvailsDashboard(),
};
export const AVAILS_SEARCH_RESULTS = {name: 'Avails > Search Results', path: '/avails/rights', search: search};
export const AVAILS_HISTORY = {name: 'Avails Ingest History', path: '/avails/history', search: search};
export const AVAILS_HISTORY_SEARCH_RESULTS = {
    name: 'Avails Ingest History > Search Results',
    path: '/avails/history',
    search: search,
};
export const RIGHT_CREATE = {name: 'Create Right', path: 'avails/rights/create', search: search};
export const RIGHTS_CREATE_FROM_PDF = {
    name: 'Manual Rights Entry',
    path: '/avails/history/manual-rights-entry',
    search: search,
};
export const RIGHTS_FIX = {name: 'Fix Rights', path: '/avails/history/fix-errors', search: search};
