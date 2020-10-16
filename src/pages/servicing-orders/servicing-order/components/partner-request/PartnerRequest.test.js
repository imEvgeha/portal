import React from 'react';
import {shallow} from 'enzyme';
import PartnerRequest from './PartnerRequest';

describe('PartnerRequest', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<PartnerRequest configuredPrId="123" externalId="345" />);
    });

    it('should render without crashing', () => {
        expect(wrapper.exists()).toEqual(true);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
