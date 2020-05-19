import React from 'react';
import {shallow} from 'enzyme';
import SOFilter from './ServiceOrderFilter';
import Button from '@atlaskit/button/dist/cjs/components/Button';

describe('SOFilter', () => {
    let wrapper;
    beforeAll(() => {
        const props = {
            soID: '12345',
            customer: 'Paramount',
            creationDate: '10/09/2020',
            createdBy: 'John Wick'
        };
        wrapper = shallow(<SOFilter orderDetails={props} />);
    });
    it('renders one parent element', () => {
        expect(wrapper.find('.so-panel-filter-detail')).toHaveLength(1);
    });

    it('renders two title line elements', () => {
        expect(wrapper.find('p.so')).toHaveLength(1);
        expect(wrapper.find('span.so')).toHaveLength(1);
    });

    it('renders one button element and a modal when clicked', () => {
        const btn = wrapper.find(Button);
        expect(btn).toHaveLength(1);
        btn.simulate('click');
        expect(wrapper.find('.so-panel-filter-detail__modal')).toHaveLength(1);
        expect(wrapper.find('h2.so')).toHaveLength(1);
        expect(wrapper.find('p.so')).toHaveLength(5);

    });
});

