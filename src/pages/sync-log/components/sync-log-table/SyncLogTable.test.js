import React from 'react';
import {shallow} from 'enzyme';
import SyncLogTable from './SyncLogTable';
import Button from '@atlaskit/button';

describe('EventManagementTable', () => {
    let wrapper;
    let syncLogGrid;

    beforeEach(() => {
        wrapper = shallow(<SyncLogTable />);
        syncLogGrid = wrapper.find('.nexus-c-sync-log-grid');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have a Download button', () => {
        expect(wrapper.find(Button).length).toEqual(1);
    });
});
