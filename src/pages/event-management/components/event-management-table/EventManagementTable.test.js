import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import {TOGGLE_REFRESH_GRID_DATA} from '../../../../ui/grid/gridActionTypes';
import EventManagementTable from './EventManagementTable';

describe('EventManagementTable', () => {
    let wrapper = null;
    let eventManagementGrid = null;
    let mockStore = null;
    let store = null;

    const onGridEventMock = jest.fn();
    const clearFiltersMock = jest.fn();

    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore({});
        wrapper = shallow(
            <EventManagementTable onGridEvent={onGridEventMock} store={store} clearFilters={clearFiltersMock} />
        )
            .dive()
            .shallow();
        eventManagementGrid = wrapper.find('.nexus-c-event-management-grid');
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
        wrapper.find('.nexus-c-event-management-table__toolbar-button').at(0).simulate('click');
        expect(clearFiltersMock).toHaveBeenCalled();
    });

    it('runs the refresh grid method when the refresh button is pressed', () => {
        const refreshButton = wrapper.find('.nexus-c-event-management-table__toolbar-button').at(1);
        refreshButton.simulate('click');

        const actions = store.getActions();
        expect(actions).toEqual([{type: TOGGLE_REFRESH_GRID_DATA, payload: true}]);
    });
});
