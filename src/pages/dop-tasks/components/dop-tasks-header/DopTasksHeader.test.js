import React from 'react';
import {shallow} from 'enzyme';
import DopTasksHeader from './DopTasksHeader';

describe('DopTasksHeader', () => {
    let wrapper = null;

    const props = {
        label: 'DOP Tasks',
    };

    beforeEach(() => {
        wrapper = shallow(<DopTasksHeader {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render header label', () => {
        const label = wrapper.find('.dop-tasks-header__label');
        expect(label.text()).toEqual('DOP Tasks');
    });
});
