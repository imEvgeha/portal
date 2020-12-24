import React from 'react';
import {shallow} from 'enzyme';
import NexusTab from './NexusTab';

describe('NexusTab', () => {
    let wrapper = null;

    const props = {
        title: 'Title',
        totalRows: 0,
        activeTab: 'Title',
    };

    beforeEach(() => {
        wrapper = shallow(<NexusTab {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render tab title and rights count', () => {
        expect(wrapper.find('.nexus-c-nexus-tab').text()).toEqual('Title (0)');
    });

    it('should display current tab as active tab', () => {
        expect(wrapper.find('.nexus-c-nexus-tab--is-active')).toHaveLength(1);
    });
});
