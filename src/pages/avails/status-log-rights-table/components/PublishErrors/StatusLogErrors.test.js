import React from 'react';
import {shallow} from 'enzyme';
import StatusLogErrors from './StatusLogErrors';

describe('StatusLogErrors', () => {
    let wrapper = null;
    const mockSetErrors = jest.fn();

    beforeEach(() => {
        wrapper = shallow(
            <StatusLogErrors
                data={{errors: [{errorType: 'Test type', description: 'Test description'}]}}
                setErrors={mockSetErrors} 
            />
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render error cell', () => {
        expect(wrapper.find('.nexus-c-status-log-table__error-cell').length).toEqual(1);
    });

    it('should call setError prop function on click of cell', () => {
        wrapper.find('.nexus-c-status-log-table__error-cell').simulate('click');
        expect(mockSetErrors.mock.calls.length).toEqual(1);
    });
});
