import React from 'react';
import {shallow} from 'enzyme';
import * as Redux from 'react-redux';
import NexusDataPanel from './NexusDataPanel';

describe('NexusDataPanel', () => {
    let wrapper = null;
    beforeEach(() => {
        wrapper = shallow(<NexusDataPanel />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render wrapper class', () => {
        expect(wrapper.find('.nexus-c-data-panel')).toHaveLength(1);
    });
});
