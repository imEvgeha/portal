import React from 'react';
import {shallow} from 'enzyme';
import {soiWithFo, soiWithFoWithoutStatus, soiWithoutFo} from '../../responses/sample-constructed-soi';
import ServicingOrderItem from './ServicingOrderItem';

describe('ServicingOrderItem', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<ServicingOrderItem soi={soiWithFo} />);
    });

    it('should render', () => {
        expect(wrapper).toBeTruthy();
    });

    it('does not render anything when there are no child FOs', () => {
        wrapper = shallow(<ServicingOrderItem soi={soiWithoutFo} />);
        expect(wrapper.html()).toBeNull();
    });

    it('displays the correct badge count', () => {
        const badgeText = wrapper.find('Badge').html();
        expect(badgeText).toContain('2');
    });

    it('displays the correct status tag', () => {
        const statusTag = wrapper.find('StatusTag').html();
        expect(statusTag).toContain('Not Started');
    });

    it('does not display the status tag, if there is no status', () => {
        wrapper = shallow(<ServicingOrderItem soi={soiWithFoWithoutStatus} />);
        const statusTag = wrapper.find('StatusTag').length;
        expect(statusTag).toEqual(0);
    });

    it('is closed by default', () => {
        const foPanels = wrapper.find('FulfillmentOrderPanel').length;
        expect(foPanels).toEqual(0);
    });
});
