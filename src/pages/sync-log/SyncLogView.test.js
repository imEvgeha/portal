import React from 'react';
import {shallow} from 'enzyme';
import SyncLogView from './SyncLogView';

describe('SyncLogView', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<SyncLogView />);

        it('should render Sync Log view title', () => {
            expect(wrapper.find('.nexus-c-sync-log-view__title').text()).toEqual('Sync Log');
        });

        it('should match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });
    });
});
