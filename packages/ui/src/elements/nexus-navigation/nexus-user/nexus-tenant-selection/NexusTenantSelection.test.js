import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import NexusTenantSelection from './NexusTenantSelection';

describe('NexusUserAvatar', () => {
    let wrapper = null;
    let mockStore = null;
    let store = null;

    beforeEach(() => {
        mockStore = configureStore();
        // add to the mockStore the attributes necessary by this component
        // mock the store with auth.selectedTenant dummy properties
        store = mockStore({
            auth: {
                selectedTenant: {
                    id: 'VU',
                    roles: ['metadata_update', 'metadata_admin', 'metadata_create', 'metadata_delete', 'metadata_view'],
                },
            },
        });
        wrapper = shallow(<NexusTenantSelection store={store} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
