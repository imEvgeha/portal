import {ALL_RIGHTS, INCOMING, SELECTED} from './selectedTab';

export const tabFilter = new Map([
    [ALL_RIGHTS, {status: 'Ready,ReadyNew', invalid: 'false'}],
    [INCOMING,  {status: 'ReadyNew', invalid: 'false'}],
    [SELECTED,  {rightSelected: true, invalid: 'false'}]
]); 