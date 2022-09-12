import React from 'react';
import {Button} from '@portal/portal-components';
import {shallow} from 'enzyme';
import {BulkMatching} from './BulkMatching';

describe('BulkMatching', () => {
    let wrapper = null;
    const headerTitle = 'Title Matching';

    beforeEach(() => {
        wrapper = shallow(<BulkMatching data={[]} headerTitle={headerTitle} headerText="Title Matching" />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render SimpleRightsMatchingTable', () => {
        expect(wrapper.find('TitleMatchingRightsTable').length).toEqual(1);
    });

    it('should render Section message', () => {
        expect(wrapper.find('SectionMessage').length).toEqual(1);
    });

    it('should have a New Title button', () => {
        // eslint-disable-next-line no-magic-numbers
        expect(wrapper.find(Button).length).toEqual(1);
    });

    it('should have render bulk match review screen when header changes', () => {
        wrapper.setProps({headerText: 'Title Matching Review'});
        expect(wrapper.find('BulkMatchingReview').length).toEqual(1);
    });

    it('should have render bonus rights review screen when header changes', () => {
        wrapper.setProps({headerText: 'Bonus Rights Review'});
        expect(wrapper.find('BonusRightsReview').length).toEqual(1);
    });
});
