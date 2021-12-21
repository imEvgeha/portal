import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import {TitleMetadataView} from '../../TitleMetadataView';

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
        wrapper = shallow(<TitleMetadataView store={store} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render bottom container for title metadata header', () => {
        expect(wrapper.find('.nexus-c-title-metadata-header__bottom')).toHaveLength(1);
    });
});
