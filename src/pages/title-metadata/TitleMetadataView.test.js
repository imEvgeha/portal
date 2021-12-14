import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import {TitleMetadataView} from './TitleMetadataView';

describe('TitleMetadataView', () => {
    let wrapper = null;
    let titleMetadataHeader = null;
    let titleMetadataTable = null;
    let tabMenu = null;
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
        titleMetadataHeader = wrapper.find('TitleMetadataHeader');
        titleMetadataTable = wrapper.find('.nexus-c-title-metadata__table');
        tabMenu = wrapper.find('.nexus-c-title-metadata__tab-menu');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render title metadata wrapper', () => {
        expect(wrapper.find('.nexus-c-title-metadata')).toHaveLength(1);
    });

    it('should render TitleMetadataHeader', () => {
        expect(titleMetadataHeader.length).toEqual(1);
    });

    it('should render TitleMetadataTable', () => {
        expect(titleMetadataTable.length).toEqual(1);
    });

    it('should render Tab menu', () => {
        expect(tabMenu.length).toEqual(1);
    });
});
