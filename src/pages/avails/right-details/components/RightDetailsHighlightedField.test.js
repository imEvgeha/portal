import React from 'react';
import {shallow} from 'enzyme';
import RightDetailsHighlightedField from './RightDetailsHighlightedField';

describe('RightDetailsHighlightedField', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<RightDetailsHighlightedField name="Title" value="Some test value" />);
    });

    it('should have two paragraphs inside div element', () => {
        expect(wrapper.find('div').find('p')).toHaveLength(2);
    });
});
