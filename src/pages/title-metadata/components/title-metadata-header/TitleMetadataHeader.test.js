import React from 'react';
import {shallow} from 'enzyme';
import TitleMetadataHeader from './TitleMetadataHeader';

describe('TitleMetadataHeader', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<TitleMetadataHeader />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
