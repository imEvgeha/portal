import React from 'react';
import {shallow} from 'enzyme';
import ServicingOrdersTable from './ServicingOrdersTable';

describe('ServicingOrdersTable', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<ServicingOrdersTable />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
