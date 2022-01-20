import React from 'react';
import {shallow} from 'enzyme';
import FieldError from './FieldError';

describe('FieldError', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<FieldError error={{}} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a p-error-message', () => {
        expect(wrapper.find('.p-error-message')).toHaveLength(1);
    });
});
