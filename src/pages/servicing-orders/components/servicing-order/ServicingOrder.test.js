import React from 'react';
import {shallow} from 'enzyme';
import ServicingOrder from './ServicingOrder';

describe('ServicingOrder', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<ServicingOrder />);
        it('should render header section', () => {
            expect(wrapper.find('HeaderSection').length).toEqual(1);
        });
        it('should render right section', () => {
            expect(wrapper.find('.servicing-order__right').length).toEqual(1);
        });
    });
});