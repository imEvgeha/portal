import React from 'react';
import {shallow} from 'enzyme';
import {soiWithFo, soiWithFoWithoutStatus, soiWithoutFo} from '../../responses/sample-constructed-soi';
import ServicingOrderItem from './ServicingOrderItem';

describe('ServicingOrderItem', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<ServicingOrderItem servicingOrderItem={soiWithFo} />);
    });

    it('should render', () => {
        expect(wrapper).toBeTruthy();
    });

    it('does not render anything when there are no child FOs', () => {
        wrapper = shallow(<ServicingOrderItem servicingOrderItem={soiWithoutFo} />);
        expect(wrapper.html()).toBeNull();
    });

    it('should include 4 badges', () => {
        const badges = wrapper.find('Badge').length;
        expect(badges).toEqual(4);
    });

    it('displays the correct badge count', () => {
        const badgeText = wrapper.find('Badge').at(3).html();
        expect(badgeText).toContain('2');
    });

    it('displays the correct status tag', () => {
        const statusTag = wrapper.find('StatusTag').html();
        expect(statusTag).toContain('Not Started');
    });

    it('does not display the status tag, if there is no status', () => {
        wrapper = shallow(<ServicingOrderItem servicingOrderItem={soiWithFoWithoutStatus} />);
        const statusTag = wrapper.find('StatusTag').length;
        expect(statusTag).toEqual(0);
    });

    it('is closed by default', () => {
        const foPanels = wrapper.find('FulfillmentOrderPanel').length;
        expect(foPanels).toEqual(0);
    });
});
