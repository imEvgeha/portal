import React from 'react';
import {shallow} from 'enzyme';
import HeaderSection from './HeaderSection';

describe('HeaderSection', () => {
    describe('HTML content', () => {
        const fulfillmentOrders = [
            {
                fulfillmentOrderId: 'VU000134567-001',
                dueDate: '10/05/2021',
                status: 'COMPLETED'
            },
            {
                fulfillmentOrderId: 'VU000134597-002',
                dueDate: '09/05/2021',
                status: 'PENDING'
            }
        ];
        const wrapper = shallow(<HeaderSection fulfillmentOrders={fulfillmentOrders} />);
        it('should render header title', () => {
            expect(wrapper.find('.panel-header .panel-header__title span').text()).toEqual('Servicing Order');
        });
        it('should have a Link component with link to servicing-orders page', () => {
            expect(wrapper.find('Link').length).toEqual(1);
            expect(wrapper.find('Link').props().to).toEqual('/servicing-orders');
        });
        it('should render 2 FulfillmentOrderPanel components', () => {
            expect(wrapper.find('FulfillmentOrderPanel').length).toEqual(2);
        });
    });
});