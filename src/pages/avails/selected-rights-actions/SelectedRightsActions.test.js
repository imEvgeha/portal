import React from 'react';
import {shallow} from 'enzyme';
import {withHooks} from 'jest-react-hooks-shallow';
import configureStore from 'redux-mock-store';
import {SelectedRightsActions} from './SelectedRightsActions';

describe('SelectedRightsActions', () => {
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

    describe('SelectedRightsActions', () => {
        beforeEach(() => {
            wrapper = shallow(
                <SelectedRightsActions
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

        it('should disable "View Rights History" option when no rights are selected', () => {
            const viewHistoryOption = wrapper.find('[data-test-id="view-history"]');
            expect(viewHistoryOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should disable "Bulk Unmatch" option when no rights are selected', () => {
            const bulkUnmatchOption = wrapper.find('[data-test-id="bulk-unmatch"]');
            expect(bulkUnmatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should disable "Create Bonus Right" option when no rights are selected', () => {
            const createBonusRights = wrapper.find('[data-test-id="bonus-rights"]');
            expect(createBonusRights.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });
    });

    describe('Bulk Unmatch', () => {
        let bulkUnmatchOption = null;

        const init = selectedRights => {
            withHooks(() => {
                mockStore = configureStore();
                store = mockStore({ui: {toast: {list: []}}});
                wrapper = shallow(
                    <SelectedRightsActions
                        selectedRights={selectedRights}
                        store={store}
                        toggleRefreshGridData={() => null}
                        selectedRightGridApi={{}}
                    />
                );
                bulkUnmatchOption = wrapper.find('[data-test-id="bulk-unmatch"]');
            });
        };

        afterEach(() => {
            wrapper = null;
            bulkUnmatchOption = null;
        });

        it('should be active when all criteria is met', () => {
            init([
                {
                    coreTitleId: '1',
                    sourceRightId: '1',
                },
                {
                    coreTitleId: '2',
                    sourceRightId: '2',
                },
            ]);
            expect(bulkUnmatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
        });

        it('should be enabled when sourceRightIds are not unique', () => {
            init([
                {
                    coreTitleId: '1',
                    sourceRightId: '1',
                },
                {
                    coreTitleId: '2',
                    sourceRightId: '1',
                },
            ]);
            expect(bulkUnmatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
        });

        it('should be enabled when sourceRightIds are not all populated', () => {
            init([
                {
                    coreTitleId: '1',
                    sourceRightId: '1',
                },
                {
                    coreTitleId: '2',
                    sourceRightId: '',
                },
            ]);
            expect(bulkUnmatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
        });

        it('should be disabled when coreTitleIds are not all populated', () => {
            init([
                {
                    coreTitleId: '',
                    sourceRightId: '1',
                },
                {
                    coreTitleId: '2',
                    sourceRightId: '2',
                },
            ]);
            expect(bulkUnmatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });
    });

    describe('Bulk Match', () => {
        let bulkMatchOption = null;

        const init = selectedRights => {
            mockStore = configureStore();
            store = mockStore({ui: {toast: {list: []}}});
            withHooks(() => {
                wrapper = shallow(
                    <SelectedRightsActions
                        selectedRights={selectedRights}
                        store={store}
                        toggleRefreshGridData={() => null}
                        selectedRightGridApi={{}}
                    />
                );
                bulkMatchOption = wrapper.find('[data-test-id="bulk-match"]');
            });
        };

        afterEach(() => {
            wrapper = null;
            bulkMatchOption = null;
        });

        it('should be active when all criteria is met', () => {
            init([
                {
                    coreTitleId: '',
                    contentType: 'movie',
                    sourceRightId: '1',
                },
                {
                    coreTitleId: '',
                    contentType: 'movie',
                    sourceRightId: '2',
                },
            ]);
            expect(bulkMatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
        });

        it('should be enabled when sourceRightIds are not unique', () => {
            init([
                {
                    coreTitleId: '',
                    contentType: 'movie',
                    sourceRightId: '1',
                },
                {
                    coreTitleId: '',
                    contentType: 'movie',
                    sourceRightId: '1',
                },
            ]);
            expect(bulkMatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
        });

        it('should be disabled when sourceRightIds are not all populated', () => {
            init([
                {
                    coreTitleId: '',
                    contentType: 'movie',
                    sourceRightId: '1',
                },
                {
                    coreTitleId: '',
                    contentType: 'movie',
                    sourceRightId: '',
                },
            ]);
            expect(bulkMatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should be disabled when coreTitleIds are populated', () => {
            init([
                {
                    coreTitleId: '',
                    contentType: 'movie',
                    sourceRightId: '1',
                },
                {
                    coreTitleId: '2',
                    contentType: 'movie',
                    sourceRightId: '2',
                },
            ]);
            expect(bulkMatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });
    });

    describe('Create Bonus Right', () => {
        let createBonusRightsOption = null;

        const init = selectedRights => {
            withHooks(() => {
                mockStore = configureStore();
                store = mockStore({ui: {toast: {list: []}}});
                wrapper = shallow(
                    <SelectedRightsActions
                        selectedRights={selectedRights}
                        store={store}
                        toggleRefreshGridData={() => null}
                        selectedRightGridApi={{}}
                    />
                );
                createBonusRightsOption = wrapper.find('[data-test-id="bonus-rights"]');
            });
        };

        afterEach(() => {
            wrapper = null;
            createBonusRightsOption = null;
        });

        it('should be active when all criteria is met', () => {
            init([
                {
                    coreTitleId: '1',
                    sourceRightId: '',
                    licensed: true,
                    status: 'ReadyNew'
                },
                {
                    coreTitleId: '1',
                    sourceRightId: '',
                    licensed: true,
                    status: 'Ready'
                },
            ]);
            expect(createBonusRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(true);
        });

        it('should be disabled when sourceRightIds are not empty', () => {
            init([
                {
                    coreTitleId: '1',
                    sourceRightId: '1',
                    licensed: true,
                    status: 'Ready'
                },
                {
                    coreTitleId: '1',
                    sourceRightId: '',
                    licensed: true,
                    status: 'Ready'
                },
            ]);
            expect(createBonusRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should be disabled when status is not Ready/ReadyNew', () => {
            init([
                {
                    coreTitleId: '1',
                    sourceRightId: '',
                    status: 'ReadyNew',
                    licensed: true,
                },
                {
                    coreTitleId: '1',
                    sourceRightId: '',
                    status: 'Pending',
                    licensed: true,
                },
            ]);
            expect(createBonusRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should be disabled when coreTitleIds are not all populated', () => {
            init([
                {
                    coreTitleId: '',
                    sourceRightId: '',
                    licensed: true,
                    status: 'Ready'
                },
                {
                    coreTitleId: '2',
                    sourceRightId: '',
                    licensed: true,
                    status: 'Ready'
                },
            ]);
            expect(createBonusRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should be disabled when coreTitleIds are not same for all rights', () => {
            init([
                {
                    coreTitleId: '1',
                    sourceRightId: '',
                    licensed: true,
                    status: 'Ready'
                },
                {
                    coreTitleId: '2',
                    sourceRightId: '',
                    licensed: true,
                    status: 'Ready'
                },
            ]);
            expect(createBonusRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should be disabled when licensed is false', () => {
            init([
                {
                    coreTitleId: '2',
                    sourceRightId: '',
                    licensed: false,
                    status: 'Ready'
                },
                {
                    coreTitleId: '2',
                    sourceRightId: '',
                    licensed: true,
                    status: 'Ready'
                },
            ]);
            expect(createBonusRightsOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });
    });
});
