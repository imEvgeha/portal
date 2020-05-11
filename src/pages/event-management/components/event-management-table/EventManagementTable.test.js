import React from 'react';
import {shallow} from 'enzyme';
import EventManagementTable from './EventManagementTable';

describe('EventManagementTable', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<EventManagementTable />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
