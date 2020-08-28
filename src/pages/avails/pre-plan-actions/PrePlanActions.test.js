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

    describe('Remove Rights Action', () => {
        beforeEach(() => {
            wrapper = shallow(<PrePlanActions selectedPrePlanRights={[]} store={store} />);
        });

        it('should match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });

        it('should disable "Remove from Pre-Plan" option when no rights are selected', () => {
            const removeRightsOption = wrapper.find('[data-test-id="remove-pre-plan"]');
            expect(removeRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should disable "Add to Selected For Planning" option when no rights are selected', () => {
            const addToSelectedRightsOption = wrapper.find('[data-test-id="add-to-pre-plan"]');
            expect(addToSelectedRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should enable both option when some rights are selected', () => {
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
            const addToSelectedRightsOption = wrapper.find('[data-test-id="add-to-pre-plan"]');
            expect(removeRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
            expect(addToSelectedRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
            removeRightsOption.simulate('click');
            expect(setPreplanRights).toHaveBeenCalled();
            expect(setSelectedPrePlanRights).toHaveBeenCalled();
        });
    });
});
