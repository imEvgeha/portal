import React from 'react';
import {shallow} from 'enzyme';
import TitlesSection from './TitlesSection';

describe('TitlesSection', () => {
    let wrapper = null;
    const props = {
        isTitlesTableLoading: false,
        onMatchAndCreate: () => null,
        closeDrawer: () => null,
        selectionList: {
            matchList: [],
            duplicateList: [],
            selectedItems: [],
            duplicateButton: {},
            matchButton: {},
            onCellValueChanged: () => null,
        },
    };
    beforeAll(() => {
        wrapper = shallow(<TitlesSection {...props} />);
        wrapper.setProps({
            isTitlesTableLoading: false,
        });
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render RightsMatchingTitlesTable', () => {
        expect(wrapper.find('RightsMatchingTitlesTable').length).toEqual(1);
    });

    it('should render Spinner', () => {
        wrapper.setProps({
            isTitlesTableLoading: true,
        });
        expect(wrapper.find('.nexus-c-bulk-matching__spinner').length).toEqual(1);
    });
});
