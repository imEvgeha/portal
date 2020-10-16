import React from 'react';
import {shallow} from 'enzyme';
import TitleHeader from './TitleHeader';

describe('TitleHeader', () => {
    let wrapper = null;
    it('should match snapshot', () => {
        wrapper = shallow(<TitleHeader title="Title" type="Type" releaseYear="1984" />);
        expect(wrapper).toMatchSnapshot();
    });
});
