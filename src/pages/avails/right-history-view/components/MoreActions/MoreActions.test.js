import React from 'react';
import {shallow} from 'enzyme';
import MoreActions from './MoreActions';

describe('MoreActions', () => {
    let wrapper = null;
    const menuItemClass = 'rights-more-actions__menu-item';

    afterEach(() => {
        wrapper = null;
    });

    it('should match snapshot', () => {
       wrapper = shallow(<MoreActions selectedRights={[]} />);
       expect(wrapper).toMatchSnapshot();
    });

    it('should disable "View Rights History" option when no rights are selected', () => {
        wrapper = shallow(<MoreActions selectedRights={[]} />);
        const viewHistoryOption = wrapper.find('[data-test-id="view-history"]');
        expect(viewHistoryOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
    });

    it('should disable "Bulk Unmatch" option when no rights are selected', () => {
        wrapper = shallow(<MoreActions selectedRights={[]} />);
        const bulkUnmatchOption = wrapper.find('[data-test-id="bulk-unmatch"]');
        expect(bulkUnmatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
    });

    describe('Bulk Unmatch', () => {
        let bulkUnmatchOption = null;

        const init = (selectedRights) => {
            wrapper = shallow(<MoreActions selectedRights={selectedRights} />);
            bulkUnmatchOption = wrapper.find('[data-test-id="bulk-unmatch"]');
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
                }
            ]);
            expect(bulkUnmatchOption.hasClass(menuItemClass)).toBe(true);
        });

        it('should be disabled when sourceRightIds are not unique', () => {
            init([
                {
                    coreTitleId: '1',
                    sourceRightId: '1',
                },
                {
                    coreTitleId: '2',
                    sourceRightId: '1',
                }
            ]);
            expect(bulkUnmatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });

        it('should be disabled when sourceRightIds are not all populated', () => {
            init([
                {
                    coreTitleId: '1',
                    sourceRightId: '1',
                },
                {
                    coreTitleId: '2',
                    sourceRightId: '',
                }
            ]);
            expect(bulkUnmatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
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
                }
            ]);
            expect(bulkUnmatchOption.hasClass(`${menuItemClass}--is-active`)).toBe(false);
        });
    });
});
