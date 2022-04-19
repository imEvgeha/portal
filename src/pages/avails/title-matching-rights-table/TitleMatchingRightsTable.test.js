import React from 'react';
import {shallow} from 'enzyme';
import TitleMatchingRightsTable from './TitleMatchingRightsTable';

describe('TitleMatchingRightsTable', () => {
    let wrapper = null;
    let TitlesTable = null;

    beforeEach(() => {
        wrapper = shallow(<TitleMatchingRightsTable data={[]} />);
        TitlesTable = wrapper.find('.titleTableForMatching');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders table wrapper', () => {
        expect(wrapper.find('.nexus-c-title-matching-rights-table')).toHaveLength(1);
    });

    it('renders Titles Table', () => {
        expect(wrapper.find('.titleTableForMatching')).toHaveLength(1);
    });

    it('should pass rowSelection prop to NexusGrid', () => {
        expect(TitlesTable.props().rowSelection).toEqual('single');
    });
});
