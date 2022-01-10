import React from 'react';
import {shallow} from 'enzyme';
import FieldLabel from './FieldLabel';

describe('FieldLabel', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<FieldLabel htmlFor="elementSchema.id" label="elementSchema.label" isRequired={true} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a label', () => {
        expect(wrapper.find('label')).toHaveLength(1);
    });
});
