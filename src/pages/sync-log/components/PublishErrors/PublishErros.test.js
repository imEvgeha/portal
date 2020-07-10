import React from 'react';
import {shallow} from 'enzyme';
import PublishErrors from './PublishErrors';

describe('PublishErrors', () => {
    let wrapper;
    const mockSetErrors = jest.fn();

    beforeEach(() => {
        wrapper = shallow(<PublishErrors value={[1, 2]} setErrors={mockSetErrors} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render cell when value length greater than 0', () => {
        expect(wrapper.find('.nexus-c-sync-log-table__error-cell').length).toEqual(1);
    });

    it('should call setError prop function on click of cell', () => {
        wrapper.find('.nexus-c-sync-log-table__error-cell').click();
        expect(mockCallback.mock.calls.length).toEqual(1);
    });

    it('should not render cell when value length is 0', () => {
        wrapper.setProps({value: []});
        expect(wrapper.find('.nexus-c-sync-log-table__error-cell').length).toEqual(0);
    });
});
