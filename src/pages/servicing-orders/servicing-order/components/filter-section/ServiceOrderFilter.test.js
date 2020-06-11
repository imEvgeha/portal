import React from 'react';
import {shallow} from 'enzyme';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import ServiceOrderFilter from './ServiceOrderFilter';

describe('SOFilter', () => {
    let wrapper;
    beforeAll(() => {
        const props = {
            soID: '12345',
            customer: 'Paramount',
            creationDate: '10/09/2020',
            createdBy: 'John Wick'
        };
        wrapper = shallow(<ServiceOrderFilter orderDetails={props} />);
    });

    it('renders one parent element', () => {
        expect(wrapper.find('.so-panel-filter-detail')).toHaveLength(1);
    });

    it('renders one button element and a modal when clicked', () => {
        const btn = wrapper.find(Button);
        expect(btn).toHaveLength(1);
        btn.simulate('click');
        expect(wrapper.find('.so-panel-filter-detail__span')).toHaveLength(1);
        expect(wrapper.find('PartnerRequest')).toHaveLength(1);
        expect(wrapper.find('.so-panel-filter-detail__p')).toHaveLength(2);

    });

    it('renders one select element', () => {
        expect(wrapper.find('.so-panel-filter-detail__section')).toHaveLength(1);
    });
});
