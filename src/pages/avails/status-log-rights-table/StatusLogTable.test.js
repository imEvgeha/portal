import React from 'react';
import {shallow} from 'enzyme';
import {StatusLogRightsTable} from './StatusLogRightsTable';

describe('StatusLogRightsTable', () => {
    let wrapper = null;
    const props = {
        activeTab: 'Status',
    };

    beforeEach(() => {
        wrapper = shallow(<StatusLogRightsTable {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render StatusLogRights table wrapper', () => {
        expect(wrapper.find('.nexus-c-sync-log-table').length).toEqual(1);
    });

    it('should render NexusDrawer', () => {
        expect(wrapper.find('NexusDrawer').length).toEqual(1);
    });
});
