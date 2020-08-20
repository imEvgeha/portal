import React from 'react';
import {shallow} from 'enzyme';
import TooltipCellRenderer from './TooltipCellRenderer';

describe('TooltipCellRenderer', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<TooltipCellRenderer value="12" soNumber="ABC123" />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a ServicingOrdersTableStatusTooltip', async () => {
        const tooltip = wrapper.props().content();
        expect(tooltip).toBeTruthy();
        expect(tooltip.props.soNumber).toEqual('ABC123');
    });
});
