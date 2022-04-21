import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import {TitleMetadataBottomHeaderPart} from './TitleMetadataBottomHeaderPart';

describe('TitleMetadataBottomHeaderPart', () => {
    let wrapper = null;
    const mockStore = configureStore();
    const store = mockStore({
        titleMetadata: {
            filter: {
                filterModel: {},
                sortModel: null,
                columnState: [],
            },
        },
    });

    beforeAll(() => {
        wrapper = shallow(<TitleMetadataBottomHeaderPart store={store} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
