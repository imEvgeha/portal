import React from 'react';
import {shallow} from 'enzyme';
import NexusTooltip from "../../../../nexus-tooltip/NexusTooltip";
import TooltipCellRenderer from './TooltipCellRenderer';

describe('TooltipCellRenderer', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<TooltipCellRenderer value="12" />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a NexusTooltip', () => {
        const tooltip = wrapper.find(NexusTooltip);
        expect(tooltip.exists()).toBeTruthy();
        expect(tooltip.props().hasWhiteBackground).toEqual(true);

    });
});
