import {gotoAvailsDashboard} from '../containers/Navbar';
import RightsURL from '../containers/avail/util/RightsURL';

export const AVAILS_DASHBOARD = {name: 'Avails Dashboard', path: '/avails', search: RightsURL.search, onClick: () => gotoAvailsDashboard()};
export const AVAILS_SEARCH_RESULTS = {name: 'Avails > Search Results', path: '/avails/rights', search: RightsURL.search};
export const AVAILS_HISTORY = {name: 'Avails Ingest History', path: '/avails/history', search: RightsURL.search};
export const AVAILS_HISTORY_SEARCH_RESULTS = {name: 'Avails Ingest History > Search Results', path: '/avails/history', search: RightsURL.search};
export const RIGHT_CREATE = {name: 'Create Right', path: 'avails/rights/create', search: RightsURL.search};
