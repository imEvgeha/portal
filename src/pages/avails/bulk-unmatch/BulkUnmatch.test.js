import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import BulkUnmatch from './BulkUnmatch';

describe('BulkUnmatch', () => {
    let wrapper = null;
    let mockStore = null;
    let store = null;
    const selectedRights = [
        {
            id: '1',
            title: 'Awesome Right',
        },
    ];

    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore({avails: {rightMatching: {columnDefs: []}}});

        wrapper = shallow(<BulkUnmatch selectedRights={selectedRights} store={store} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
