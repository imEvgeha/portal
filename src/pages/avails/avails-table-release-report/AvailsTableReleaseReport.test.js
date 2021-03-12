import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import AvailsTableReleaseReport from './AvailsTableReleaseReport';

describe('AvailsTableReleaseReport', () => {
    let wrapper = null;
    let mockStore = null;
    let store = null;

    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore({ui: {toast: {list: []}}});
        wrapper = shallow(<AvailsTableReleaseReport store={store} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
