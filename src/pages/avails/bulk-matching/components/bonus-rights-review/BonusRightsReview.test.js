import React from 'react';
import {shallow} from 'enzyme';
import BonusRightsReview from './BonusRightsReview';

describe('BonusRightsReview', () => {
    let wrapper = null;
    const props = {
        bonusRights: [],
        existingBonusRights: [],
        closeDrawer: null,
    };
    beforeAll(() => {
        wrapper = shallow(<BonusRightsReview {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render created tab at first', () => {
        const firstActiveTab = wrapper
            .find('Tab')
            .at(0)
            .shallow()
            .find('.nexus-c-bonus-rights-review__tabs--tab.active-tab');
        expect(firstActiveTab.text().includes('Created')).toBe(true);
    });

    it('should render existing tab', () => {
        const secondTab = wrapper.find('Tab').at(1).shallow().find('.nexus-c-bonus-rights-review__tabs--tab');
        secondTab.props().onClick();
        expect(secondTab.hasClass('active-tab')).toBe(true);
    });
});
