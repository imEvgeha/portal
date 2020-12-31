import React from 'react';
import {shallow} from 'enzyme';
import ArtworkActions from './ArtworkActions';

describe('ArtworkActions', () => {
    let wrapper = null;
    const setItemMock = jest.fn();
    const props = {
        selectedItems: 3,
        totalItems: 5,
        setItems: setItemMock,
    };
    beforeAll(() => {
        wrapper = shallow(<ArtworkActions {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle Checkbox select all', () => {
        wrapper.find('WithAnalyticsContext(WithAnalyticsEvents(Checkbox))').props().onChange();
        expect(setItemMock).toHaveBeenCalled();
    });

    it('should display Reject all button when few items are selected', () => {
        wrapper.setProps({selectedItems: 2});
        wrapper.update();
        expect(wrapper.find('WithAnalyticsContext(WithAnalyticsEvents(Button))').length).toEqual(1);
    });

    it('should not display Reject all button when no items are selected', () => {
        wrapper.setProps({selectedItems: 0});
        wrapper.update();
        expect(wrapper.find('WithAnalyticsContext(WithAnalyticsEvents(Button))').length).toEqual(0);
    });
});
