import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import SyncLogDatePicker from './SyncLogDatePicker';

describe('SyncLogDatePicker', () => {
    let wrapper = null;
    let nexusDatePicker = null;
    let timeTable = null;
    const mockStore = configureStore();
    const store = mockStore({
        titleMetadata: {
            filter: {
                filterModel: {},
                sortModel: null,
                columnState: [],
            },
        },
    });

    beforeAll(() => {
        wrapper = shallow(<SyncLogDatePicker store={store} />);
        nexusDatePicker = wrapper.find('NexusDatePicker');
        timeTable = wrapper.find('.nexus-c-sync-log-table__date-field');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render main Date Picker Container', () => {
        expect(wrapper.find('.nexus-c-sync-log-table__date-filter')).toHaveLength(1);
    });

    it('should render both NexusDatePickers', () => {
        expect(nexusDatePicker.length).toEqual(2);
    });

    it('should render both NexusDatePicker containers', () => {
        expect(timeTable.length).toEqual(2);
    });
});
