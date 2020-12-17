import React from 'react';
import * as DateTimeContext from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-time-context/NexusDateTimeProvider';
import {TOGGLE_REFRESH_GRID_DATA} from '@vubiquity-nexus/portal-ui/lib/grid/gridActionTypes';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import EventManagementTable from './EventManagementTable';

describe('EventManagementTable', () => {
    let wrapper = null;
    let eventManagementGrid = null;
    let mockStore = null;
    let store = null;

    const onGridEventMock = jest.fn();
    const clearFiltersMock = jest.fn();

    const spy = jest.spyOn(DateTimeContext, 'useDateTimeContext');
    const mockFnIsLocal = bool => spy.mockImplementationOnce(() => ({isLocal: bool, setIsLocal: jest.fn()}));

    const init = () => {
        wrapper = shallow(
            <EventManagementTable onGridEvent={onGridEventMock} store={store} clearFilters={clearFiltersMock} />
        )
            .dive()
            .shallow();
    };

    beforeEach(() => {
        mockFnIsLocal(false);
        mockStore = configureStore();
        store = mockStore({});
        init();
        eventManagementGrid = wrapper.find('.nexus-c-event-management-grid');
    });

    afterEach(() => {
        spy.mockReset();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should pass rowSelection prop to EventManagementGrid', () => {
        expect(eventManagementGrid.props().rowSelection).toEqual('single');
    });

    it('should pass onGridEvent prop to EventManagementGrid', () => {
        eventManagementGrid.props().onGridEvent();
        expect(onGridEventMock.mock.calls.length).toEqual(1);
    });

    it('runs the clearFilters method when the clear filters button is pressed', () => {
        wrapper.find('.nexus-c-event-management-table__toolbar-button').at(1).simulate('click');
        expect(clearFiltersMock).toHaveBeenCalled();
    });

    it('runs the refresh grid method when the refresh button is pressed', () => {
        const refreshButton = wrapper.find('.nexus-c-event-management-table__toolbar-button').at(2);
        refreshButton.simulate('click');

        const actions = store.getActions();
        expect(actions).toEqual([{type: TOGGLE_REFRESH_GRID_DATA, payload: true}]);
    });

    describe('Set Time Format Button ', () => {
        it('shows `Set To Local Time` when the DateTimeContext is set to UTC Time', () => {
            // set isLocal to false, which is UTC time
            mockFnIsLocal(false);
            // re-init the wrapper
            init();

            const button = wrapper.find('.nexus-c-event-management-table__toolbar-button').at(0);
            expect(button.text()).toContain('Local');
        });

        it('shows `Set To UTC Time` when the DateTimeContext is set to Local Time', () => {
            // set isLocal to true, which is local time
            mockFnIsLocal(true);
            // re-init the wrapper
            init();

            const button = wrapper.find('.nexus-c-event-management-table__toolbar-button').at(0);
            expect(button.text()).toContain('UTC');
        });
    });
});
