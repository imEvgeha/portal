import React from 'react';
import {shallow} from 'enzyme';
import Button from '@atlaskit/button';
import {BulkMatching} from './BulkMatching';

describe('BulkMatching', () => {
    let wrapper = null;
    let titleMatchingRightsTable = null;
    let sectionMessage = null;
    const selectedClass = 'nexus-c-bulk-matching__selected';
    const affectedClass = 'nexus-c-bulk-matching__affected';
    const headerTitle = 'Title Matching';

    beforeEach(() => {
        wrapper = shallow(<BulkMatching data={[]} headerTitle={headerTitle} />);

        titleMatchingRightsTable = wrapper.find('TitleMatchingRightsTable');
        sectionMessage = wrapper.find('SectionMessage');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render SimpleRightsMatchingTable', () => {
        expect(titleMatchingRightsTable.length).toEqual(1);
    });

    it('should render Section message', () => {
        expect(sectionMessage.length).toEqual(1);
    });

    it('should render header title', () => {
        expect(wrapper.find('h2').text()).toEqual(headerTitle);
    });

    it('should have a New Title button', () => {
        // eslint-disable-next-line no-magic-numbers
        expect(wrapper.find(Button).length).toEqual(2);
    });

    it('should display selected rights tab on load', () => {
        const selectedTab = wrapper.find('.nexus-c-bulk-matching__selected');
        expect(selectedTab.hasClass(`${selectedClass}--active`)).toBe(true);
    });

    it('should not display affected tab on load', () => {
        const affectedTab = wrapper.find('.nexus-c-bulk-matching__affected');
        expect(affectedTab.hasClass(`${affectedClass}--active`)).toBe(false);
    });

    it('should have a new title button and a new title link', () => {
        expect(wrapper.find('.nexus-c-bulk-matching__btn').length).toEqual(1);
    });
});
