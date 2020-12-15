import React from 'react';
import {shallow} from 'enzyme';
import NexusLayout from './NexusLayout';

describe('NexusLayout', () => {
    let wrapper = null;
    beforeAll(() => {
        wrapper = shallow(<NexusLayout />);
    });
    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
