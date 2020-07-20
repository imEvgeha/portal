import React from 'react';
import {shallow} from 'enzyme';
import Button from '@atlaskit/button';
import {BulkMatching} from './BulkMatching';
import {RIGHT_TABS} from './constants';

describe('BulkMatching', () => {
    let wrapper = null;
    let titleMatchingRightsTable = null;
    let sectionMessage = null;
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

    it('should have a New Title button', () => {
        // eslint-disable-next-line no-magic-numbers
        expect(wrapper.find(Button).length).toEqual(2);
    });

    it('should display selected rights tab on load', () => {
        const selectedTab = wrapper.find('.nexus-c-bulk-matching__rights-tab--active');
        expect(selectedTab.text().includes(RIGHT_TABS.SELECTED)).toBe(true);
    });

    it('should not display affected tab on load', () => {
        const selectedTab = wrapper.find('.nexus-c-bulk-matching__rights-tab--active');
        expect(selectedTab.text().includes(RIGHT_TABS.AFFECTED)).toBe(false);
    });

    it('should not display bonus rights tab on load', () => {
        const selectedTab = wrapper.find('.nexus-c-bulk-matching__rights-tab--active');
        expect(selectedTab.text().includes(RIGHT_TABS.BONUS_RIGHTS)).toBe(false);
    });

    it('should display affected tab on click', () => {
        wrapper.find('.nexus-c-bulk-matching__rights-tab').at(1)
            .props()
            .onClick();
        expect(wrapper.find('.nexus-c-bulk-matching__rights-tab--active').text()
            .includes(RIGHT_TABS.AFFECTED)).toBe(true);
    });

    it('should not display affected tab when bonus right', () => {
        wrapper.setProps({isBonusRight: true});
        expect(wrapper.find('.nexus-c-bulk-matching__rights-tab').length).toEqual(2);
    });

    it('should display bonus rights tab on click', () => {
        wrapper.setProps({isBonusRight: true});
        wrapper.find('.nexus-c-bulk-matching__rights-tab').at(1)
            .props()
            .onClick();
        expect(wrapper.find('.nexus-c-bulk-matching__rights-tab--active').text()
            .includes(RIGHT_TABS.BONUS_RIGHTS)).toBe(true);
    });

    it('should have a new title button and a new title link', () => {
        expect(wrapper.find('.nexus-c-bulk-matching__btn').length).toEqual(1);
    });
});
