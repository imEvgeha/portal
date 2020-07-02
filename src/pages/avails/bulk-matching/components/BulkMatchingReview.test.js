import React from 'react';
import {shallow} from 'enzyme';
import BulkMatchingReview from './BulkMatchingReview';
import Button from '@atlaskit/button';

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
        expect(table).toHaveLength(2);
    });

    it('renders Done button', () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});
