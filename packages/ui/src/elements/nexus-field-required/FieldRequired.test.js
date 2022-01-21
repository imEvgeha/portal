import React from 'react';
import {shallow} from 'enzyme';
import FieldRequired from './FieldRequired';

describe('FieldRequired', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<FieldRequired required={true} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should be required', () => {
        expect(wrapper.find('.p-field-required')).toHaveLength(1);
    });
});
