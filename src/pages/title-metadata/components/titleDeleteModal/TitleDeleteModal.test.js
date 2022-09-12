import React from 'react';
import {shallow} from 'enzyme';
import {withHooks} from 'jest-react-hooks-shallow';
import TitleDeleteModal from './TitleDeleteModal';

describe('TitleDeleteModal', () => {
    let defaultWrapper = null;

    describe('Default TitleDeleteModal', () => {
        withHooks(() => {
            defaultWrapper = shallow(
                <TitleDeleteModal
                    header="Delete Title(s)"
                    onDelete={() => null}
                    display={true}
                    onCloseModal={() => null}
                />
            );
        });

        it('should match snapshot', () => {
            expect(defaultWrapper).toMatchSnapshot();
        });

        it('should render main dialog window for delete title', () => {
            expect(defaultWrapper.find('.nexus-c-title-delete_dialog')).toHaveLength(1);
        });
    });
});
