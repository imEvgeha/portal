import React from 'react';
import {shallow} from 'enzyme';
import ArtworkItem from './ArtworkItem';

describe('ArtworkItem', () => {
    let wrapper = null;
    const onClickMock = jest.fn();
    const props = {
        poster: 'some-image',
        timing: '122323',
        onClick: onClickMock,
        isSelected: false,
    };
    beforeAll(() => {
        wrapper = shallow(<ArtworkItem {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have image tag with correct src', () => {
        expect(wrapper.find('img').props().src).toEqual('some-image');
    });

    it('should have artwork-item--selected when item is selected', () => {
        wrapper.setProps({isSelected: true});
        expect(wrapper.find('.artwork-item.artwork-item--selected').length).toEqual(1);
    });

    it('should handle click of image', () => {
        wrapper.find('img').simulate('click');
        expect(onClickMock).toHaveBeenCalled();
    });
});
