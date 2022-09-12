import React from 'react';
import {Button} from '@portal/portal-components';
import {shallow} from 'enzyme';
import BulkDeleteActions from './BulkDeleteActions';

describe('BulkDeleteActions', () => {
    let wrapper = null;
    const onCloseMock = jest.fn();
    const onSubmitMock = jest.fn();

    const props = {
        onClose: onCloseMock,
        onSubmit: onSubmitMock,
    };
    beforeEach(() => {
        wrapper = shallow(<BulkDeleteActions {...props} />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders Cancel and Delete buttons', () => {
        expect(wrapper.find(Button)).toHaveLength(2);
    });

    it('should call onClose', () => {
        const cancelBtn = wrapper.find('.nexus-c-bulk-delete-actions__cancel-btn');
        cancelBtn.simulate('click');
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('should call onSubmit', () => {
        const submitBtn = wrapper.find('.nexus-c-bulk-delete-actions__delete-btn');
        submitBtn.simulate('click');
        expect(onSubmitMock).toHaveBeenCalled();
    });
});
