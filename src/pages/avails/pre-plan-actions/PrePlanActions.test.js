import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import {PrePlanActions} from './PrePlanActions';

describe('PrePlanActions', () => {
    let wrapper = null;
    let mockStore = null;
    let store = null;
    const menuItemClass = 'nexus-c-selected-rights-actions__menu-item';

    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore({ui: {toast: {list: []}}});
    });

    afterEach(() => {
        wrapper = null;
    });

    describe('PrePlanActions', () => {
        beforeEach(() => {
            wrapper = shallow(
                <PrePlanActions
                    selectedRights={[]}
                    store={store}
                    toggleRefreshGridData={() => null}
                    selectedRightGridApi={{}}
                />
            );
        });

        it('should match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });

        it('should disable "Remove from Pre-Plan" option when no rights are selected', () => {
            const viewHistoryOption = wrapper.find('[data-test-id="remove-pre-plan"]');
            expect(viewHistoryOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });
    });

});
