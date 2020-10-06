import React from 'react';
import Lozenge from '@atlaskit/lozenge';
import {shallow} from 'enzyme';
import RightDetailsTags from './RightDetailsTags';

describe('RightDetailsTags', () => {
    let wrapper = null;

    beforeEach(() => {
        const right = {
            bonusRight: 'yes',
            originalRightIds: 'someId',
        };

        wrapper = shallow(<RightDetailsTags right={right} />);
    });

    it('should have four elements in children prop', () => {
        expect(wrapper.props().children).toHaveLength(4);
    });

    it('should have two atlaskits Lozenge components', () => {
        expect(wrapper.find(Lozenge)).toHaveLength(2);
    });
});
