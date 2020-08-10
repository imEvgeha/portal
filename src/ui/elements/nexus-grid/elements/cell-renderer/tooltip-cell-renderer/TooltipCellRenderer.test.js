import React from 'react';
import {shallow} from 'enzyme';
import TooltipCellRenderer from './TooltipCellRenderer';

describe('TooltipCellRenderer', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<TooltipCellRenderer value="IN PROGRESS" />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should apply proper coloring for given value', () => {
        const cellRenderer = wrapper.find('.nexus-c-emphasized-cell-renderer--is-teal');
        expect(cellRenderer.exists()).toBeTruthy();
    });
});
