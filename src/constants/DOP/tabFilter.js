import {ALL_RIGHTS, INCOMING, SELECTED} from './selectedTab';

export const initialTabFilter = {
    [ALL_RIGHTS]: {status: 'Ready,ReadyNew'},
    [INCOMING]: {status: 'ReadyNew'},
    [SELECTED]: {rightSelected: true},
};