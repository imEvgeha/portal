import React from 'react';
import {Button} from '@portal/portal-components';
import {shallow} from 'enzyme';
import PartnerRequest from '../partner-request/PartnerRequest';
import ServiceOrderFilter from './ServiceOrderFilter';

describe('SOFilter', () => {
    let wrapper = null;
    beforeAll(() => {
        const props = {
            soID: '12345',
            customer: 'Paramount',
            creationDate: '10/09/2020',
            createdBy: 'John Wick',
        };
        wrapper = shallow(<ServiceOrderFilter orderDetails={props} />);
    });

    it('renders one parent element', () => {
        expect(wrapper.find('.so-panel-filter-detail')).toHaveLength(1);
    });

    it('renders one button element and a drawer when clicked', () => {
        const btn = wrapper.find(Button);
        expect(btn).toHaveLength(1);
        btn.simulate('click');
        expect(wrapper.find(PartnerRequest)).toHaveLength(1);
    });

    it('renders two select elements', () => {
        expect(wrapper.find('.so-panel-filter-detail__dropdown')).toHaveLength(2);
    });
});
