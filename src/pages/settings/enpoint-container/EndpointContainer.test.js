import React from 'react';
import {shallow} from 'enzyme';
import * as Redux from 'react-redux';
import EndpointContainer from './EndpointContainer';

describe('EndpointContainer', () => {
    let wrapper = null;
    const selectedApi = {
        id: 'afl_fdecRLziop',
        type: 'affiliate',
        createdAt: '2021-03-17T10:48:15.903Z',
        updatedAt: '2021-09-03T12:21:34.918Z',
        createdBy: 'e7a612ba-24a0-4054-97e5-27a68755ad36',
        updatedBy: 'c4be121a-312f-4b5f-a8d3-1ead1237e342',
        value: 'A1 BULGARIA',
        permutations: ['A1 BULGARIA'],
    };
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    const useSelectorSpy = jest.spyOn(Redux, 'useSelector');
    const useDispatchSpy = jest.spyOn(Redux, 'useDispatch');

    useStateSpy.mockImplementation(init => [init, setState]);
    useSelectorSpy.mockReturnValue({});
    useDispatchSpy.mockImplementation(() => cb => cb);

    beforeEach(() => {
        wrapper = shallow(<EndpointContainer endpoint={selectedApi} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render wrapper class', () => {
        expect(wrapper.find('.nexus-c-endpoint-container')).toHaveLength(1);
    });
});
