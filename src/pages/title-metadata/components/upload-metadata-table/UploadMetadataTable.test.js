import React from 'react';
import {shallow} from 'enzyme';
import {Provider} from 'react-redux';
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
        wrapper = shallow(
            <Provider store={store}>
                <UploadMetadataTable />
            </Provider>
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
