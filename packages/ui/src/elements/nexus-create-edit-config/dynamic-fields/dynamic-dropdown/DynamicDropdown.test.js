import React from 'react';
import {shallow} from 'enzyme';
import DynamicDropdown from './DynamicDropdown';

describe('DynamicDropdown', () => {
    let wrapper = null;
    let value = {};
    const form = {
        getValues: () => 'value',
    };
    const elementSchema = {
        id: 'type',
        name: 'type',
        type: 'select',
        required: true,
        label: 'Type',
        options: [
            {
                items: ['country', 'region'],
            },
        ],
    };

    const onChange = e => {
        value = e;
    };

    beforeEach(() => {
        wrapper = shallow(
            <DynamicDropdown formField={{...value}} elementSchema={elementSchema} change={onChange} form={form} />
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a Dropdown', () => {
        expect(wrapper.find('Dropdown')).toHaveLength(1);
    });
});
