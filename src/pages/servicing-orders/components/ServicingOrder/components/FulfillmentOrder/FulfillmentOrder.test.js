import React from 'react';
import {shallow} from 'enzyme';
import FulfillmentOrder from './FulfillmentOrder';

describe('FulfillmentOrder', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<FulfillmentOrder />);
        it('should render header title', () => {
            expect(wrapper.find('.fulfillment-order .fulfillment-order__title').text()).toEqual('Fulfillment Order');
        });
    });
});