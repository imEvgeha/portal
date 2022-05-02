import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import NexusUserAvatar from './NexusUserAvatar';

describe('NexusUserAvatar', () => {
    let wrapper = null;
    let mockStore = null;
    let store = null;

    beforeEach(() => {
        mockStore = configureStore();
        // add to the mockStore the attributes necessary by this component
        store = mockStore({
            auth: {
                userAccount: {
                    username: 'mcharalambous',
                    firstName: 'Marios',
                    lastName: 'Charalambous',
                    email: 'marios.charalambous@vubiquity.net',
                    emailVerified: false,
                },
            },
        });
        wrapper = shallow(<NexusUserAvatar store={store} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
