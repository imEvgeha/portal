import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import RightDetails from './RightDetails';

describe('RightDetails', () => {
    let wrapper = null;

    beforeEach(() => {
        const mockStore = configureStore();
        const store = mockStore({
            ui: {
                avails: {
                    rights: {right: {id: 'rght_zrp8g'}},
                    rightDetailsOptions: {selectValues: {format: [{value: 'HD'}]}},
                },
            },
        });
        const params = {params: {id: 'rght_zrp8g'}};
        wrapper = shallow(<RightDetails match={params} store={store} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
