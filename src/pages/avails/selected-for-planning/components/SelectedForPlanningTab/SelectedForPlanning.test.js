import React from 'react';
import {shallow} from 'enzyme';
import SelectedForPlanningTab from './SelectedForPlanningTab';

describe('SelectedForPlanningTab', () => {
    let wrapper = null;
    const props = {};
    beforeAll(() => {
        wrapper = shallow(<SelectedForPlanningTab {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});