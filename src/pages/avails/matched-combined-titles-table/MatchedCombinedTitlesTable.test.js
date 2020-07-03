import React from 'react';
import {shallow} from 'enzyme';
import MatchedCombinedTitlesTable from './MatchedCombinedTitlesTable';

describe('MatchedCombinedTitlesTable', () => {
    let wrapper = null;
    let tableWrapper = null;

    beforeEach(() => {
        wrapper = shallow(<MatchedCombinedTitlesTable />);
        tableWrapper = wrapper.find('.nexus-c-matched-combined-titles-table-wrapper');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render table wraper', () => {
        expect(tableWrapper).toHaveLength(1);
    });

    it('should render nexus grid', () => {
        expect(wrapper.find('NexusGrid')).toHaveLength(1);
    });
});
