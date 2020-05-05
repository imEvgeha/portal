import React from 'react';
import {shallow} from 'enzyme';
import ServicingOrders from './ServicingOrders';

describe('ServicingOrders', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<ServicingOrders />);
        it('should render header title', () => {
            expect(wrapper.find('.servicing-orders .servicing-orders--title').text()).toEqual('Servicing Orders');
        });
    });
});