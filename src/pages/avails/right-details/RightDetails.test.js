import React from 'react';
import {shallow} from 'enzyme';
import RightDetails from './RightDetails';

describe('RightDetails', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<RightDetails />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
