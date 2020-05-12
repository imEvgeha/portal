import React from 'react';
import {shallow} from 'enzyme';
import EventManagement from './EventManagement';

describe('EventManagement', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<EventManagement />);
        it('should render header title', () => {
            expect(wrapper.find('.nexus-c-event-management .nexus-c-event-management__title').text()).toEqual('Event Management');
        });
    });
});
