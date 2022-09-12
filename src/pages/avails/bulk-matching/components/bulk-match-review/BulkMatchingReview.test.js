import React from 'react';
import {Button} from '@portal/portal-components';
import {shallow} from 'enzyme';
import BulkMatchingReview from './BulkMatchingReview';

describe('BulkMatchingReview', () => {
    let wrapper = null;
    let table = null;

    beforeAll(() => {
        wrapper = shallow(<BulkMatchingReview />);
        table = wrapper.find('MatchedCombinedTitlesTable');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders review wrapper', () => {
        expect(wrapper.find('.nexus-c-bulk-matching-review')).toHaveLength(1);
    });

    it('renders matched titles title', () => {
        expect(wrapper.find('.nexus-c-bulk-matching-review__matched')).toHaveLength(1);
    });

    it('renders combined titles title', () => {
        expect(wrapper.find('.nexus-c-bulk-matching-review__combined')).toHaveLength(1);
    });

    it('renders two MatchedCombinedTitlesTable elements', () => {
        // eslint-disable-next-line no-magic-numbers
        expect(table).toHaveLength(2);
    });

    it('renders Done button', () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('should render bonus rights review', () => {
        wrapper.setProps({bonusRights: []});
        expect(wrapper.find('BonusRightsReview')).toHaveLength(1);
    });

    it('should not render bonus rights review', () => {
        wrapper.setProps({bonusRights: null});
        expect(wrapper.find('BonusRightsReview')).toHaveLength(0);
    });
});
