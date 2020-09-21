import React from 'react';
import {shallow} from 'enzyme';
import EventDrawer from './EventDrawer';

describe('EventDrawer', () => {
    describe('HTML content', () => {
        const onCloseMock = jest.fn();
        const id = '123';
        const wrapper = shallow(<EventDrawer onDrawerClose={onCloseMock} id={id} />);

        it('should render NexusDrawer', () => {
            expect(wrapper.find('NexusDrawer').length).toEqual(1);
        });
        it('should pass correct isOpen prop to NexusDrawer when event is selected', () => {
            expect(wrapper.find('NexusDrawer').props().isOpen).toEqual(true);
        });

        it('should pass correct isOpen prop to NexusDrawer when event is not selected', () => {
            wrapper.setProps({id: null});
            expect(wrapper.find('NexusDrawer').props().isOpen).toEqual(false);
        });
        it('should pass correct closeDrawer function prop NexusDrawer', () => {
            wrapper.find('NexusDrawer').props().onClose();
            expect(onCloseMock.mock.calls.length).toEqual(1);
        });
    });
});
