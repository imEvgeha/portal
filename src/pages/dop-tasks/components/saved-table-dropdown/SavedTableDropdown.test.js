import React from 'react';
import {shallow} from 'enzyme';
import {SAVED_TABLE_DROPDOWN_LABEL} from '../../constants';
import SavedTableDropdown from './SavedTableDropdown';

describe('SavedTableDropdown', () => {
    let wrapper = null;
    let dropDownMenu = null;

    beforeEach(() => {
        wrapper = shallow(<SavedTableDropdown />);
        dropDownMenu = wrapper.find('DropdownMenu');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render DropDownMenu', () => {
        expect(dropDownMenu.length).toEqual(1);
    });

    it('should display dropdown label', () => {
        const label = wrapper.find('.nexus-c-dop-tasks-dropdown__label');
        expect(label.text()).toEqual(SAVED_TABLE_DROPDOWN_LABEL);
    });
});
