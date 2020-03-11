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
});

