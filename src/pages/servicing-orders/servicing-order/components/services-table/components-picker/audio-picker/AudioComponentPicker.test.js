import React from 'react';
import {shallow} from 'enzyme';
import {AudioChannelsTable} from './AudioComponentsPicker';
import {testRows} from '../constants';

describe('AudioChannelsTable', () => {
    let wrapper = null;
    wrapper = shallow(<AudioChannelsTable dataRows={testRows} checkAll={null} unCheckAll={null} />);

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
