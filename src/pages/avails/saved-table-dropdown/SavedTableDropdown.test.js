import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import SavedTableDropdown from './SavedTableDropdown';

describe('SavedTableDropdown', () => {
    let wrapper = null;
    const mockStore = configureStore();
    const store = mockStore({
        avails: {
            rights: {gridState: {}},
        },
    });
    const props = {store};
    beforeAll(() => {
        wrapper = shallow(<SavedTableDropdown {...props} />)
            .dive()
            .shallow();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render label', () => {
        expect(wrapper.find('.nexus-c-saved-table-dropdown__label').text()).toEqual('Saved Table Views:');
    });

    it('should render creatable select', () => {
        expect(wrapper.find('.nexus-c-saved-table-dropdown__select').length).toEqual(1);
    });
});
