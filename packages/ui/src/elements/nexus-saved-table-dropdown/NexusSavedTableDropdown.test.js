import React from 'react';
import {shallow} from 'enzyme';
import NexusSavedTableDropdown from './NexusSavedTableDropdown';

describe('NexusSavedTableDropdown', () => {
    let wrapper = null;
    let dropDownMenu = null;

    beforeEach(() => {
        wrapper = shallow(<NexusSavedTableDropdown />);
        dropDownMenu = wrapper.find('DropdownMenu');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render DropDownMenu', () => {
        expect(dropDownMenu.length).toEqual(1);
    });
});
