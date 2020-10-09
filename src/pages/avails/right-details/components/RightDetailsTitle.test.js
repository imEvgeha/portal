import React from 'react';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {shallow} from 'enzyme';
import RightDetailsTitle from './RightDetailsTitle';

describe('RightDetailsTitle', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<RightDetailsTitle title="Right Details" />);
    });

    it('should have ArrowLeftIcon component in span element', () => {
        expect(wrapper.find('span').find(ArrowLeftIcon)).toHaveLength(1);
    });
});
