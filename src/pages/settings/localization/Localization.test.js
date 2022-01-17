import React from 'react';
import {shallow} from 'enzyme';
import * as Redux from 'react-redux';
import Localization from './Localization';

describe('Localization', () => {
    let wrapper = null;

    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    const useSelectorSpy = jest.spyOn(Redux, 'useSelector');
    const useDispatchSpy = jest.spyOn(Redux, 'useDispatch');

    useStateSpy.mockImplementation(init => [init, setState]);
    useSelectorSpy.mockReturnValue({});
    useDispatchSpy.mockImplementation(() => cb => cb);

    beforeEach(() => {
        wrapper = shallow(<Localization />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render localization panel', () => {
        expect(wrapper.find('.nexus-c-localization-panel')).toHaveLength(1);
    });
});
