import React from 'react';
import {shallow} from 'enzyme';
import * as Redux from 'react-redux';
import configureStore from 'redux-mock-store';
import {StatusRightsActions} from './StatusRightsActions';

describe('StatusRightsActions', () => {
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
                statusLogResyncRights: {},
            },
        },
    });

    beforeEach(() => {
        wrapper = shallow(<StatusRightsActions store={store} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render status actions wrapper', () => {
        expect(wrapper.find('.nexus-c-status-rights-actions')).toHaveLength(1);
    });

    it('should render status action item', () => {
        expect(wrapper.find('.nexus-c-status-rights-actions__menu-item')).toHaveLength(1);
    });
});
