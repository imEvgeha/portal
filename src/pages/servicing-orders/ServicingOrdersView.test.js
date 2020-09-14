import React from 'react';
import {shallow} from 'enzyme';
import ServicingOrdersView from './ServicingOrdersView';

describe('ServicingOrdersView', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<ServicingOrdersView />);
        it('should render header title', () => {
            expect(wrapper.find('h1').text()).toEqual('Servicing Orders');
        });
        it('should match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });
    });
});
