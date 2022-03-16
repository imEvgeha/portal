import React from 'react';
import {shallow} from 'enzyme';
import {SelectedForPlanning} from './SelectedForPlanning';

describe('SelectedForPlanning', () => {
    let wrapper = null;
    const props = {};
    beforeAll(() => {
        wrapper = shallow(<SelectedForPlanning {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
