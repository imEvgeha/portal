import React from 'react';
import {shallow} from 'enzyme';
import SimpleRightsMatchingTable from './SimpleRightsMatchingTable';

describe('SimpleRightsMatchingTable', () => {
    let wrapper, NexusGrid;

    beforeEach(() => {
        wrapper = shallow(<SimpleRightsMatchingTable data={[]} />);
        NexusGrid = wrapper.find('NexusGrid');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders table wrapper', () => {
        expect(wrapper.find('.nexus-c-simple-rights-matching-table')).toHaveLength(1);
    });

    it('renders Nexus Grid', () => {
        expect(wrapper.find('NexusGrid')).toHaveLength(1);
    });

    it('should pass rowSelection prop to NexusGrid', () => {
        expect(NexusGrid.props().rowSelection).toEqual('single');
        expect(NexusGrid.props().onSelectionChanged).toBeInstanceOf(Function);
    });
});
