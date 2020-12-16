import {can} from '../../../../ability';
import {navigationPrimaryItems} from './NavigationItems';
import {EVENT_MANAGEMENT} from '../constants';

jest.mock('../../../../ability');

const isEventManagement = item => item.id === EVENT_MANAGEMENT;

describe('Nexus Navigation Items', () => {
    it('contains all nav items, including event management when event_viewer is enabled', () => {
        can.mockImplementation(() => true);

        const hasEventMgmtBtn = navigationPrimaryItems('test', () => null).filter(isEventManagement).length > 0;

        expect(hasEventMgmtBtn).toBeTruthy();
    });

    it('contains all nav items, except event management when event_viewer is disabled', () => {
        can.mockImplementation(() => false);

        const hasEventMgmtBtn = navigationPrimaryItems('test', () => null).filter(isEventManagement).length > 0;

        expect(hasEventMgmtBtn).toBeFalsy();
    });
});
