import React from 'react';
import {shallow} from 'enzyme';
import Title from './Title';
import EditorialMetadata from './editorial-metadata/EditorialMetadata';
import {METADATA_TITLE_SECTIONS, METADATA_TITLE_EDITORIAL_SECTION} from './constants';

describe('Title', () => {
    let wrapper = null;
    const sectionTabClass = '.nexus-c-metadata-title__section-tab';

    beforeEach(() => {
        wrapper = shallow(
            <Title
                coreTitleData={{
                    title: 'AtlasKit 101',
                    type: 'Comedy',
                    releaseYear: '2020',
                }}
            />
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render tabs', () => {
        expect(wrapper.find(sectionTabClass)).toHaveLength(METADATA_TITLE_SECTIONS.length);
    });

    it('should render section when respective tab is clicked', () => {
        const EMetTab = wrapper.findWhere(
            node =>
                node.hasClass('nexus-c-metadata-title__section-tab') && node.text() === METADATA_TITLE_EDITORIAL_SECTION
        );
        EMetTab.simulate('click');
        expect(wrapper.contains(<EditorialMetadata />)).toBeTruthy();
    });
});
