import React from 'react';
import Button from '@atlaskit/button';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import EventManagementTable from './EventManagementTable';

describe('EventManagementTable', () => {
    let wrapper = null;
    let eventManagementGrid = null;
    let mockStore = null;
    let store = null;
    const onGridEventMock = jest.fn();

    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore({});
        wrapper = shallow(<EventManagementTable onGridEvent={onGridEventMock} store={store} />)
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

    it('should have a Refresh button', () => {
        expect(wrapper.find(Button).length).toEqual(1);
    });
});
