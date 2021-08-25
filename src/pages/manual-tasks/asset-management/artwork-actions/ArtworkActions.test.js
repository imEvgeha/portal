import React from 'react';
import {shallow} from 'enzyme';
import ArtworkActions from './ArtworkActions';

describe('ArtworkActions', () => {
    let wrapper = null;
    const setItemMock = jest.fn();
    const props = {
        selectedItems: 3,
        totalItems: 5,
        setSelectedItems: setItemMock,
    };
    beforeAll(() => {
        wrapper = shallow(<ArtworkActions {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should not display Reject all button when no items are selected', () => {
        wrapper.setProps({selectedItems: 0});
        wrapper.update();
        expect(wrapper.find('Button').length).toEqual(0);
    });
});
