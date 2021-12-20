import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import DownloadEmetModal from './DownloadEmetModal';

describe('TitleMetadataBottomHeaderPart', () => {
    let wrapper = null;
    const mockStore = configureStore();
    const store = mockStore({
        avails: {
            rightDetailsOptions: {
                selectValues: {},
                areValid: true,
                isSaving: false
            }
        }
    });

    beforeAll(() => {
        wrapper = shallow(<DownloadEmetModal store={store} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render download metadata modal', () => {
        expect(wrapper.find('.nexus-c-download-emet-modal__field')).toHaveLength(1);
    });
});
