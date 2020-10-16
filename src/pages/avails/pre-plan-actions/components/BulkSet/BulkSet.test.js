import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import BulkSet from './BulkSet';

describe('BulkSet', () => {
    let wrapper = null;

    beforeEach(() => {
        const mockStore = configureStore();
        const store = mockStore({
            avails: {
                rightDetailsOptions: {selectValues: {country: []}},
            },
        });
        wrapper = shallow(<BulkSet store={store} />)
            .shallow()
            .shallow();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render NexusTextArea for keywords', () => {
        expect(wrapper.find('NexusTextArea').length).toEqual(1);
    });
});
