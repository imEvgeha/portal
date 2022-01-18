import React from 'react';
import {shallow} from 'enzyme';
import * as Redux from 'react-redux';
import SettingsPage from './SettingsPage';

describe('Settings Page', () => {
    let wrapper = null;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    const useSelectorSpy = jest.spyOn(Redux, 'useSelector');
    const useDispatchSpy = jest.spyOn(Redux, 'useDispatch');

    useStateSpy.mockImplementation(init => [init, setState]);
    useSelectorSpy.mockReturnValue({});
    useDispatchSpy.mockImplementation(() => cb => cb);
    beforeEach(() => {
        wrapper = shallow(<SettingsPage />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render wrapper class', () => {
        expect(wrapper.find('.nexus-c-settings-page')).toHaveLength(1);
    });
});
