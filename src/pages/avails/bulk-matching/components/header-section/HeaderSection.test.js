import React from 'react';
import {Button} from '@portal/portal-components';
import {shallow} from 'enzyme';
import {RIGHT_TABS} from '../../constants';
import HeaderSection from './HeaderSection';

describe('HeaderSection', () => {
    let wrapper = null;
    const props = {
        activeTab: RIGHT_TABS.SELECTED,
        affectedRights: 2,
        existingBonusRights: 1,
        isBonusRight: false,
        isNewTitleDisabled: true,
        selectedRights: 1,
        changeActiveTab: () => null,
        showModal: () => null,
    };
    beforeAll(() => {
        wrapper = shallow(<HeaderSection {...props} />);
        wrapper.setProps({
            changeActiveTab: tab => wrapper.setProps({activeTab: tab}),
        });
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have a New Title button', () => {
        // eslint-disable-next-line no-magic-numbers
        expect(wrapper.find(Button).length).toEqual(1);
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
        wrapper.find('.nexus-c-bulk-matching__rights-tab').at(1).props().onClick();
        expect(wrapper.find('.nexus-c-bulk-matching__rights-tab--active').text().includes(RIGHT_TABS.AFFECTED)).toBe(
            true
        );
    });

    it('should not display affected tab when bonus right', () => {
        wrapper.setProps({isBonusRight: true});
        expect(wrapper.find('.nexus-c-bulk-matching__rights-tab').length).toEqual(2);
    });

    it('should display bonus rights tab on click', () => {
        wrapper.setProps({isBonusRight: true});
        wrapper.find('.nexus-c-bulk-matching__rights-tab').at(1).props().onClick();
        expect(
            wrapper.find('.nexus-c-bulk-matching__rights-tab--active').text().includes(RIGHT_TABS.BONUS_RIGHTS)
        ).toBe(true);
    });

    it('should have a new title button and a new title link', () => {
        expect(wrapper.find('.nexus-c-bulk-matching__btn').length).toEqual(1);
    });
});
