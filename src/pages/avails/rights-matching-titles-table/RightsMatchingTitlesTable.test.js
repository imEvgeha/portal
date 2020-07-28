import React from 'react';
import {shallow} from 'enzyme';
import RightsMatchingTitlesTable from './RightsMatchingTitlesTable';

describe('RightsMatchingTitlesTable', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<RightsMatchingTitlesTable />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
