import React from 'react';
import {shallow} from 'enzyme';
import TextSummaryPanel from './TextSummaryPanel';

describe('TextSummaryPanel', () => {
    const list = [
        {language: 'ENGLISH', format: 'testCC', amsComponentId: '123'},
        {language: 'FRENCH', format: 'testSubtitle', amsComponentId: '12356'},
        {language: 'DANISH', format: 'testCC', amsComponentId: '123654'},
    ];
    let wrapper = null;
    wrapper = shallow(<TextSummaryPanel list={list} remove={null} />);

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
