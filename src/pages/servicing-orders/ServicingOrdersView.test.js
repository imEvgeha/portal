import React from 'react';
import {shallow} from 'enzyme';
import ServicingOrdersView from './ServicingOrdersView';

describe('ServicingOrdersView', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<ServicingOrdersView />);
        it('should render header title', () => {
            expect(wrapper.find('.servicing-orders .servicing-orders--title').text()).toEqual('Servicing Orders');
        });
        it('should render match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });
    });
});