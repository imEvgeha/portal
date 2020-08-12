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

    describe('sorting by due date', () => {
        it('should sort panels by due date -- ascending', () => {
            const dueDateNodes = wrapper.map(node =>
                node
                    .dive()
                    .text()
                    .match(/\d{1,2}\/\d{1,2}\/\d{4}/g)
            );
            expect(dueDateNodes).toEqual([
                ['01/01/2020', '02/02/2020'],
                ['03/03/2020'],
                ['04/04/2020', '05/05/2020'],
                ['06/06/2020'],
                ['07/07/2020', '08/08/2020'],
                null,
            ]);
        });

        it('should sort panels by due date -- descending', () => {
            wrapper = shallow(
                <FulfillmentOrderPanels
                    dueDateSortDirection={SORT_DIRECTION[1]}
                    orderDetails={mockResponse}
                    fulfillmentOrders={mockResponse.fulfillmentOrders}
                    selectedFulfillmentOrder="fo_E7cyGeiy"
                    handleFulfillmentOrderChange={() => null}
                />
            );
            const dueDateNodes = wrapper.map(node =>
                node
                    .dive()
                    .text()
                    .match(/\d{1,2}\/\d{1,2}\/\d{4}/g)
            );
            expect(dueDateNodes).toEqual([
                null,
                ['07/07/2020', '08/08/2020'],
                ['06/06/2020'],
                ['04/04/2020', '05/05/2020'],
                ['03/03/2020'],
                ['01/01/2020', '02/02/2020'],
            ]);
        });
    });
});
