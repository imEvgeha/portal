import React from 'react';
import {shallow} from 'enzyme';
import FulfillmentOrderPanel from './FulfillmentOrderPanel';

describe('FulfillmentOrderPanel', () => {
    let wrapper = null;
    let handleFulfillmentOrderChange = null;

    beforeEach(() => {
        handleFulfillmentOrderChange = jest.fn();

        const props = {
            handleFulfillmentOrderChange,
            id: 'VU000134567-001',
            dueDate: '10/05/2021',
            status: 'COMPLETED',
            selected: false,
        };
        wrapper = shallow(<FulfillmentOrderPanel {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have a fulfillment-order-panel div and call setSelectedFulfillmentOrder when is clicked', () => {
        const fulfillmentOrderPanel = wrapper.find('.nexus-c-fulfillment-order-panel');
        expect(fulfillmentOrderPanel).toHaveLength(1);
        fulfillmentOrderPanel.simulate('click');
        expect(handleFulfillmentOrderChange).toHaveBeenCalled();
    });

    it('should have a servicer indicator', () => {
        const servicerElement = wrapper.find('.nexus-c-fulfillment-order-panel__servicer');
        expect(servicerElement).toHaveLength(1);
    });
});
