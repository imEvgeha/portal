import React from 'react';
import {shallow} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {StatusRightsActions} from './StatusRightsActions';

describe('StatusRightsActions', () => {
    let wrapper = null;
    let store = null;

    beforeEach(() => {
        const mockStore = configureStore();
        store = mockStore({});
        wrapper = shallow(
            <Provider store={store}>
                <StatusRightsActions />
            </Provider>
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
