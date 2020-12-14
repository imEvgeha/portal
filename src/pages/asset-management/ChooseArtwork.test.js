import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import ChooseArtwork from './ChooseArtwork';

describe('ChooseArtwork', () => {
    let wrapper = null;
    const mockStore = configureStore();
    const props = {
        store: mockStore({assetManagement: {posterList: []}}),
    };

    beforeAll(() => {
        wrapper = shallow(<ChooseArtwork {...props} />)
            .find('ChooseArtwork')
            .shallow();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render ArtworkActions', () => {
        expect(wrapper.find('ArtworkActions').length).toEqual(1);
    });

    it('should render 0 items', () => {
        expect(wrapper.find('ArtworkItem').length).toEqual(0);
    });

    it('should render 1 item', () => {
        wrapper = shallow(<ChooseArtwork {...props} store={mockStore({assetManagement: {posterList: ['abc']}})} />)
            .find('ChooseArtwork')
            .shallow();
        expect(wrapper.find('ArtworkItem').length).toEqual(1);
    });
});
