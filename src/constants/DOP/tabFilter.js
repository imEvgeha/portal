import {ALL_RIGHTS, INCOMING, SELECTED} from './selectedTab';

export const tabFilter = new Map([
    [ALL_RIGHTS, {status: 'Ready,ReadyNew'}],
    [INCOMING,  {status: 'ReadyNew'}],
    [SELECTED,  {rightSelected: true}]
]); 