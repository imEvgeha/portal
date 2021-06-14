import React from 'react';
import {shallow} from 'enzyme';
import EditPerson from './EditPerson';

describe('EditPerson', () => {
    let wrapper = null;
    const onClickMock = jest.fn();
    const props = {
        onClick: onClickMock,
    };
    beforeAll(() => {
        wrapper = shallow(<EditPerson {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render the Edit icon', () => {
        expect(wrapper.find('EditFilledIcon').length).toEqual(1);
    });

    it('should render the Edit icon', () => {
        wrapper.find('EditFilledIcon').props().onClick();
        expect(onClickMock.mock.calls.length).toEqual(1);
    });
});
