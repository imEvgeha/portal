import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import TitleMetadataTable from './TitleMetadataTable';

describe('TitleMetadataTable', () => {
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
        wrapper = shallow(<TitleMetadataTable store={store} />)
            .dive()
            .shallow();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders TitleMetadataTableGrid wrapper', () => {
        expect(wrapper.find('.nexus-c-title-metadata-table')).toHaveLength(1);
    });
});
