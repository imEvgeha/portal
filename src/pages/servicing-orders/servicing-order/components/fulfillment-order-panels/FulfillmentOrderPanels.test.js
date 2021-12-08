import React from 'react';
import {shallow} from 'enzyme';
import mockResponse from '../../responses/sample-fulfillment-order-response.json';
import {SORT_DIRECTION} from '../filter-section/constants';
import FulfillmentOrderPanels from './FulfillmentOrderPanels';

describe('FulfillmentOrderPanels', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(
            <FulfillmentOrderPanels
                dueDateSortDirection={SORT_DIRECTION[0]}
                orderDetails={mockResponse}
                fulfillmentOrders={mockResponse.fulfillmentOrders}
                selectedFulfillmentOrder="fo_E7cyGeiy"
                handleFulfillmentOrderChange={() => null}
            />
        );
    });

    it('should render', () => {
        expect(wrapper).toBeTruthy();
    });

    it('should render 4 ServicingOrderItem components', () => {
        const soiComponents = wrapper.find('ServicingOrderItem').length;
        expect(soiComponents).toEqual(4);
    });

    it('should render 2 FulfillmentOrderPanel components', () => {
        const foComponents = wrapper.find('FulfillmentOrderPanel').length;
        expect(foComponents).toEqual(2);
    });
});
