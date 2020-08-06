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
        },
    ];

    const prePlanRepoRights = [
        {
            id: '1',
            title: 'Awesome Right',
        },
        {
            id: '2',
            title: 'Awesome Right 2',
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
            wrapper = shallow(
                <PrePlanActions
                    selectedRights={[]}
                    store={store}
                    toggleRefreshGridData={() => null}
                    gridApi={null}
                />
            );
        });

        it('should match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });

        it('should disable "Remove from Pre-Plan" option when no rights are selected', () => {
            const removeRightsOption = wrapper.find('[data-test-id="remove-pre-plan"]');
            expect(removeRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should enable "Remove from Pre-Plan" option when some rights are selected', () => {
            const setPrePlanRepoRights = jest.fn();
            const setSelectedRights = jest.fn();
            const toggleRefreshGridData = jest.fn();

            wrapper = shallow(
                <PrePlanActions
                    selectedRights={selectedRights}
                    prePlanRepoRights={prePlanRepoRights}
                    store={store}
                    toggleRefreshGridData={toggleRefreshGridData}
                    setSelectedRights={setSelectedRights}
                    setPrePlanRepoRights={setPrePlanRepoRights}
                    gridApi={null}
                />
            );
            const removeRightsOption = wrapper.find('[data-test-id="remove-pre-plan"]');
            expect(removeRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
            removeRightsOption.simulate('click');
            expect(setPrePlanRepoRights).toHaveBeenCalled();
            expect(setSelectedRights).toHaveBeenCalled();
            expect(toggleRefreshGridData).toHaveBeenCalled();
        });
    });

});
