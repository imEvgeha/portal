import React from 'react';
import {shallow} from 'enzyme';
import {BULK_DELETE_WARNING_MSG} from '../../constants';
import BulkDeleteConfirmation from './BulkDeleteConfirmation';

describe('BulkDeleteConfirmation', () => {
    let wrapper = null;

    const props = {
        rightsCount: 3,
    };

    beforeEach(() => {
        wrapper = shallow(<BulkDeleteConfirmation {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders bulk delete confirmation message', () => {
        expect(wrapper.find('.nexus-c-bulk-delete-confirmation__message').text()).toEqual(
            `${BULK_DELETE_WARNING_MSG(props.rightsCount)}`
        );
    });

    it('renders Delete and Cancel buttons', () => {
        expect(wrapper.find('BulkDeleteActions')).toHaveLength(1);
    });
});
