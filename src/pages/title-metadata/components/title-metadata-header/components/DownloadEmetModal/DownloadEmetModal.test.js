import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import DownloadEmetModal from './DownloadEmetModal';

describe('DownloadEmetModal', () => {
    let wrapper = null;
    const mockStore = configureStore();
    const store = mockStore({
        avails: {
            rightDetailsOptions: {
                selectValues: {
                    languages: [],
                    locale: [],
                },
            }
        }
    });
    
    beforeAll(() => {
        wrapper = shallow(<DownloadEmetModal store={store} />).dive().shallow();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render download metadata modal', () => {
        expect(wrapper.find('.nexus-c-download-emet-modal')).toHaveLength(1);
    });
});
