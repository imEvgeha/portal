import React from 'react';
import {shallow} from 'enzyme';
import HeaderSection from './HeaderSection';

describe('HeaderSection', () => {
    describe('HTML content', () => {
        const wrapper = shallow(<HeaderSection />);
        it('should render header title', () => {
            expect(wrapper.find('.panel-header .panel-header__title span').text()).toEqual('Servicing Order');
        });
        it('should have a Link component with link to servicing-orders page', () => {
            expect(wrapper.find('Link').length).toEqual(1);
            expect(wrapper.find('Link').props().to).toEqual('/servicing-orders');
        });
    });
});