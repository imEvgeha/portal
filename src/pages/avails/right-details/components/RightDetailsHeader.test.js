import React from 'react';
import {shallow} from 'enzyme';
import RightDetailsHeader from './RightDetailsHeader';

describe('RightDetailsHeader', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<RightDetailsHeader title="RightDetails" />);
    });

    it('should have four divs', () => {
        expect(wrapper.props().children).toHaveLength(4);
    });

    it('should not have adjust-padding class if not shrinked', () => {
        expect(wrapper.props().className).toBe('nexus-c-right-details-header');
    });
});
