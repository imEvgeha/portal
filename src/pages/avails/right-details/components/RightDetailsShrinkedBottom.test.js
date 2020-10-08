import React from 'react';
import {shallow} from 'enzyme';
import RightDetailsShrinkedBottom from './RightDetailsShrinkedBottom';

describe('RightDetailsShrinkedBottom', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<RightDetailsShrinkedBottom name="Title" value="Some test value" />);
    });

    it('should have one paragraph', () => {
        expect(wrapper.find('p')).toHaveLength(1);
    });
});
