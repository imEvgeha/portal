import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import UploadMetadataTable from './UploadMetadataTable';

describe('UploadMetadataTable', () => {
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
        wrapper = shallow(<UploadMetadataTable store={store} />)
        .dive()
        .shallow();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders UploadMetadataTableGrid wrapper', () => {
        expect(wrapper.find('.nexus-c-upload-metadata-table')).toHaveLength(1);
    });
});
