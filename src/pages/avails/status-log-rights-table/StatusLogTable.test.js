import React from 'react';
import {shallow} from 'enzyme';
import * as Redux from 'react-redux';
import configureStore from 'redux-mock-store';
import StatusLogRightsTable from './StatusLogRightsTable';

describe('StatusLogRightsTable', () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    const useSelectorSpy = jest.spyOn(Redux, 'useSelector');
    const useDispatchSpy = jest.spyOn(Redux, 'useDispatch');

    useStateSpy.mockImplementation(init => [init, setState]);
    useSelectorSpy.mockReturnValue({});
    useDispatchSpy.mockImplementation(() => cb => cb);

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

    it('should render StatusLogRights table wrapper', () => {
        expect(wrapper.find('.nexus-c-status-log-table').length).toEqual(1);
    });

    it('should render NexusDrawer', () => {
        expect(wrapper.find('NexusDrawer').length).toEqual(1);
    });
});
