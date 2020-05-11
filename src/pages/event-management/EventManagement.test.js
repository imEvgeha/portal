import React from 'react';
import {shallow} from 'enzyme';
import EventManagement from './EventManagement';

describe('EventManagement', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<EventManagement />);
        it('should render header title', () => {
            expect(wrapper.find('.event-management .event-management__title').text()).toEqual('Event Management');
        });
    });
});