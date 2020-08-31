import React from 'react';
import {Checkbox} from '@atlaskit/checkbox';
import {shallow} from 'enzyme';
import BulkDeleteTable from './BulkDeleteTable';

describe('BulkDeleteTable', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<BulkDeleteTable />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders DynamicTable', () => {
        expect(wrapper.find('DynamicTable')).toHaveLength(1);
    });

    it('renders Checkbox item', () => {
        expect(wrapper.find(Checkbox)).toHaveLength(1);
    });
});
