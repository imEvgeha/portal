import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import StatusLogRightsTable from './StatusLogRightsTable';

describe('StatusLogRightsTable', () => {
    let wrapper = null;

    const mockStore = configureStore();

    const store = mockStore({
        avails: {
            statusLog: {
                resyncRights: {},
                activeTab: 'Status',
            },
        },
    });

    beforeEach(() => {
        wrapper = shallow(<StatusLogRightsTable store={store} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
