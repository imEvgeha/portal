import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import {PrePlanActions} from './PrePlanActions';

describe('PrePlanActions', () => {
    let wrapper = null;
    let mockStore = null;
    let store = null;
    const menuItemClass = 'nexus-c-selected-rights-actions__menu-item';
    const selectedRights = [
        {
            id: '1',
            title: 'Awesome Right',
            territory: [
                {
                    selected: true,
                    countryName: 'US',
                },
            ],
        },
    ];

    const prePlanRepoRights = [
        {
            id: '1',
            title: 'Awesome Right',
            territory: [
                {
                    selected: true,
                    countryName: 'US',
                },
            ],
        },
        {
            id: '2',
            title: 'Awesome Right 2',
            territory: [
                {
                    selected: true,
                    countryName: 'US',
                },
            ],
        },
    ];

    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore({ui: {toast: {list: []}}});
    });

    afterEach(() => {
        wrapper = null;
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    describe('Pre-plan Actions', () => {
        beforeEach(() => {
            wrapper = shallow(<PrePlanActions selectedPrePlanRights={[]} store={store} />);
        });

        it('should disable "Remove from Pre-Plan" option when no rights are selected', () => {
            const removeRightsOption = wrapper.find('[data-test-id="remove-pre-plan"]');
            expect(removeRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should disable "Add to Selected For Planning" option when no rights are selected', () => {
            const addToSelectedRightsOption = wrapper.find('[data-test-id="add-to-select-for-planning"]');
            expect(addToSelectedRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should disable bulk set option when no rights are selected', () => {
            const bulkSetOption = wrapper.find('[data-test-id="bulk-set-territories-keywords"]');
            expect(bulkSetOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should enable all options when some rights are selected', () => {
            const setPreplanRights = jest.fn();
            const setSelectedPrePlanRights = jest.fn();

            wrapper = shallow(
                <PrePlanActions
                    selectedPrePlanRights={selectedRights}
                    setPreplanRights={setPreplanRights}
                    prePlanRepoRights={prePlanRepoRights}
                    store={store}
                    setSelectedPrePlanRights={setSelectedPrePlanRights}
                    username="user1"
                />
            );
            const removeRightsOption = wrapper.find('[data-test-id="remove-pre-plan"]');
            const addToSelectedRightsOption = wrapper.find('[data-test-id="add-to-select-for-planning"]');
            expect(removeRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
            expect(addToSelectedRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
            removeRightsOption.simulate('click');
            expect(setPreplanRights).toHaveBeenCalled();
            expect(setSelectedPrePlanRights).toHaveBeenCalled();
            const bulkSetOption = wrapper.find('[data-test-id="bulk-set-territories-keywords"]');
            expect(bulkSetOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
        });
    });
});
