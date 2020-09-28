import React from 'react';
import {shallow} from 'enzyme';
import QueuedTasks from './QueuedTasks';

describe('QueuedTasks', () => {
    let wrapper = null;
    let select = null;

    beforeEach(() => {
        wrapper = shallow(<QueuedTasks />);
        select = wrapper.find('.nexus-c-dop-tasks-queued-select');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render atlaskit select', () => {
        expect(select.length).toEqual(1);
    });
});
