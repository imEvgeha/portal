import React from 'react';
import {shallow} from 'enzyme';
import EventManagement from './EventManagement';

describe('EventManagement', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<EventManagement />);
        it('should render header title', () => {
            expect(wrapper.find('.event-management .event-management__title').text()).toEqual('Event Management');
        });
        it('should render EventDrawer', () => {
            expect(wrapper.find('EventDrawer').length).toEqual(1);
        });
        it('should send correct props to EventDrawer', () => {
            expect(wrapper.find('EventDrawer').props().eventId).toEqual('');
            wrapper.find('EventDrawer').props().onDrawerClose();
            expect(wrapper.state('selectedEvent')).toEqual('');
        });
    });
});