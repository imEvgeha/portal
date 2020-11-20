import React from 'react';
import {shallow} from 'enzyme';
import {TITLE_METADATA} from '../../constants';
import TitleMetadataHeader from './TitleMetadataHeader';

describe('TitleMetadataHeader', () => {
    let wrapper = null;

    const props = {
        label: TITLE_METADATA,
    };

    beforeEach(() => {
        wrapper = shallow(<TitleMetadataHeader {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render header label', () => {
        const label = wrapper.find('.nexus-c-title-metadata-header__label');
        expect(label.text()).toEqual(TITLE_METADATA);
    });
});
