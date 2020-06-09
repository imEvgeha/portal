import React from 'react';
import {shallow} from 'enzyme';
import EventManagementTable from './EventManagementTable';

describe('EventManagementTable', () => {
    let wrapper;
    const onGridEventMock = jest.fn();

    beforeEach(() => {
        wrapper = shallow(<EventManagementTable onGridEvent={onGridEventMock} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should pass rowSelection prop to EventManagementGrid', () => {
        expect(wrapper.props().rowSelection).toEqual('single');
    });

    it('should pass onGridEvent prop to EventManagementGrid', () => {
        wrapper.props().onGridEvent();
        expect(onGridEventMock.mock.calls.length).toEqual(1);
    });
});
