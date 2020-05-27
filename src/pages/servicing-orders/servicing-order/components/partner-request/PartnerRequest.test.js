import React from 'react';
import {shallow} from 'enzyme';
import PartnerRequest from './PartnerRequest';

describe('PartnerRequest', () => {
    let wrapper;

    beforeEach(() => {
        const orderDetails = {
            customer: '',
            srID: '',
            creationDate: '',
            createdBy: '',
        };

        wrapper = shallow(<PartnerRequest orderDetails={orderDetails} />);
    });

    it('should render without crashing', () => {
        expect(wrapper.exists()).toEqual(true);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
