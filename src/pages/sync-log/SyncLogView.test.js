import React from 'react';
import {shallow} from 'enzyme';
import SyncLogView from './SyncLogView';

describe('SyncLogView', () => {
    describe('HTML content', () => {
        let wrapper = null;
        let syncLogTableWrapper = null;

        beforeEach(() => {
            wrapper = shallow(<SyncLogView />);
            syncLogTableWrapper = wrapper.find('Connect(SyncLogTable)');
        });

        it('should render Sync Log view title', () => {
            expect(wrapper.find('.nexus-c-sync-log-view__title').text()).toEqual('Sync Log');
        });

        it('should match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });

        it('should render SyncLogTable', () => {
            expect(syncLogTableWrapper.length).toEqual(1);
        });
    });
});
