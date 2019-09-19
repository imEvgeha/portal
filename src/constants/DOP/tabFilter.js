import {ALL_RIGHT, INCOMING, SELECTED} from './selectedTab';

export const tabFilter = new Map([
    [ALL_RIGHT, {status: 'Ready,ReadyNew', invalid: 'false'}],
    [INCOMING,  {status: 'ReadyNew', invalid: 'false'}],
    [SELECTED,  {rightSelected: true, invalid: 'false'}]
]); 