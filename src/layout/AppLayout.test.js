import React from 'react';
import {shallow} from 'enzyme';

import AppLayout from './AppLayout';

describe('AppLayout', () => {
    let wrapper;
    beforeAll(() => {
        wrapper = shallow(<AppLayout />);
    });
    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
    // TODO: Temporary test to see if CI works
    it('should not fail test that tests if failing tests stop deployment', () => {
        throw new Error('it failed, yay!');
    });
});

