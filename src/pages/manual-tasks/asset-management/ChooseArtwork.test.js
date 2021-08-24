import React from 'react';
import {shallow} from 'enzyme';
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
        wrapper = shallow(<ChooseArtwork store={store} />)
            .find('ChooseArtwork')
            .shallow();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render ArtworkActions', () => {
        expect(wrapper.find('ArtworkActions').length).toEqual(1);
    });

    it('should render 1 item', () => {
        expect(wrapper.find('ArtworkItem').length).toEqual(1);
    });
});
