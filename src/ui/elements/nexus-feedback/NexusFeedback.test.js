import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import NexusFeedback from './NexusFeedback';

describe('NexusFeedback', () => {
    const mockStore = configureStore();
    const store = mockStore({ui: {toast: {list: []}}});
    const wrapper = shallow(<NexusFeedback close={() => null} currentPage="test" store={store} />);
    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
