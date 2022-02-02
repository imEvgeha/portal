import React from 'react';
import {shallow} from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ChooseArtwork from './ChooseArtwork';

describe('ChooseArtwork', () => {
    let wrapper = null;
    const mockStore = configureStore();
    const store = mockStore({
        manualTasks: {
            assets: {
                posterList: ['abc'],
            },
        },
    });

    beforeAll(() => {
        wrapper = shallow(
            <Provider store={store}>
                <ChooseArtwork />
            </Provider>
        ).find('ChooseArtwork');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
