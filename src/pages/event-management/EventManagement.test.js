import React from 'react';
import {shallow} from 'enzyme';
import EventManagement from './EventManagement';
import {GRID_EVENTS} from '../../ui/elements/nexus-grid/constants';

describe('EventManagement', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<EventManagement />);
        it('should render header title', () => {
            expect(wrapper.find('.nexus-c-event-management .nexus-c-event-management__title').text()).toEqual('Event Management');
        });
        it('should render EventDrawer', () => {
            expect(wrapper.find('EventDrawer').length).toEqual(1);
        });

        const deselectAllMock = jest.fn();
        const event = {eventId:'123'};
        const gridApiMock = {
            deselectAll: deselectAllMock,
            getSelectedRows: () => ([event]),
        };
        const eventManagementTableWrapper = wrapper.find('EventManagementTable');
        const {READY, SELECTION_CHANGED} = GRID_EVENTS;
        it('should render EventManagementTable', () => {
            expect(eventManagementTableWrapper.length).toEqual(1);
        });
        it('should set api on grid event and passes correct prop to EventDrawer', () => {
            eventManagementTableWrapper.props().onGridEvent({type: READY, api: gridApiMock});
            eventManagementTableWrapper.props().onGridEvent({type: SELECTION_CHANGED, api: gridApiMock});
            wrapper.update();
            expect(wrapper.find('EventDrawer').props().event).toEqual(event);
        });
        it('should correct prop to close drawer in EventDrawer', () => {
            eventManagementTableWrapper.props().onGridEvent({type: READY, api: gridApiMock});
            eventManagementTableWrapper.props().onGridEvent({type: SELECTION_CHANGED, api: gridApiMock});
            wrapper.update();
            wrapper.find('EventDrawer').props().onDrawerClose();
            expect(deselectAllMock.mock.calls.length).toEqual(1);
        });
    });
});
