import React from 'react';
import {Field as AKField} from '@atlaskit/form';
import {shallow} from 'enzyme';
import NexusArray from './NexusArray';

describe('NexusArray', () => {
    let wrapper = null;
    const props = {
        key: 'rightId',
        name: 'rightId',
        label: 'Right ID',
        type: 'string',
        isDisabled: true,
        defaultValue: 'rght_zrp8g',
    };

    beforeEach(() => {
        wrapper = shallow(<NexusArray {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a AKField', () => {
        const textField = wrapper.find(AKField);
        expect(textField.length).toEqual(1);
    });
});
