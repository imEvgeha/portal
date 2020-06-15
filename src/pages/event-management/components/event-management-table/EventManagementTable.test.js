import React from 'react';
import {shallow} from 'enzyme';
import EventManagementTable from './EventManagementTable';
import Button from '@atlaskit/button';

describe('EventManagementTable', () => {
    let wrapper, eventManagementGrid;
    const onGridEventMock = jest.fn();

    beforeEach(() => {
        wrapper = shallow(<EventManagementTable onGridEvent={onGridEventMock} />);
        eventManagementGrid = wrapper.find('.nexus-c-event-management-grid');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should pass rowSelection prop to EventManagementGrid', () => {
        expect(eventManagementGrid.props().rowSelection).toEqual('single');
        expect(eventManagementGrid.props().setForceRefresh).toBeInstanceOf(Function);
    });

    it('should pass onGridEvent prop to EventManagementGrid', () => {
        eventManagementGrid.props().onGridEvent();
        expect(onGridEventMock.mock.calls.length).toEqual(1);
    });

    it('should have a Refresh button', () => {
        expect(wrapper.find(Button).length).toEqual(1);
    });
});
