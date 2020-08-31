import React from 'react';
import {shallow} from 'enzyme';
import RightDetails from './RightDetails';
import mapping from './structureMapping.json';

describe('RightDetails', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<RightDetails />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render tab container and all tabs within', () => {
        const TABS = (mapping || []).map(({title = ''}) => title);
        const tabContainer = wrapper.find('.nexus-c-right-details__tab-container');
        expect(tabContainer.length).toEqual(1); // Container exists

        expect(tabContainer.children().length).toEqual(TABS.length); // Container has all tabs

        tabContainer.children().forEach((child, index) => {
            expect(child.dive().text()).toEqual(TABS[index]); // All tabs are named properly
        })
    });
});
