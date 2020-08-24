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
        const firstTab = wrapper.find('Tab').at(0).shallow().find('.nexus-c-bonus-rights-review__tabs--tab');
        expect(firstTab.hasClass('active-tab')).toBe(true);
    });
});
