import React from 'react';
import {shallow} from 'enzyme';
import mockFulfillmentOrderResponse from '../../responses/sample-fulfillment-order-response.json';
import {SORT_DIRECTION} from '../filter-section/constants';
import HeaderSection from './HeaderSection';

describe('HeaderSection', () => {
    describe('HTML content', () => {
        const mockResponse = mockFulfillmentOrderResponse;

        const wrapper = shallow(<HeaderSection orderDetails={mockResponse} />);

        it('should render header title', () => {
            expect(wrapper.find('.panel-header__title--text').text()).toEqual('Servicing Order');
        });

        it('should have a Link component with link to servicing-orders page', () => {
            const linkElem = wrapper.find('#lnkServicingOrders');
            expect(linkElem.length).toEqual(1);
            expect(linkElem.props().to).toEqual(-1);
        });

        it('sorts due dates by default - ascending', () => {
            const sortDirection = wrapper.find('ServiceOrderFilter').prop('sortDirection');

            expect(sortDirection).toEqual(SORT_DIRECTION[0]);
        });

        it('does not filter Fulfillment Orders by default', () => {
            const {fulfillmentOrders} = wrapper.find('ServiceOrderFilter').prop('orderDetails');
            expect(fulfillmentOrders.length).toEqual(8);
        });

        it('correctly filters by status', () => {
            wrapper.find('ServiceOrderFilter').prop('setFilter')('NOT_STARTED');
            const orders = wrapper.find('FulfillmentOrderPanels').prop('fulfillmentOrders');
            expect(orders.length).toEqual(2);
        });
    });
});
