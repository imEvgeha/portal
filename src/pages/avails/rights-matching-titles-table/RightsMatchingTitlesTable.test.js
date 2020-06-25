import React from 'react';
import {shallow} from 'enzyme';
import RightsMatchingTitlesTable from './RightsMatchingTitlesTable';

describe('RightsMatchingTitlesTable', () => {
    let wrapper, rightsMatchingTitlesTable;

    beforeEach(() => {
        wrapper = shallow(<RightsMatchingTitlesTable />);
        rightsMatchingTitlesTable = wrapper.find('.nexus-c-rights-matching-titles-table');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
