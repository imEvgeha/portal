import React from 'react';
import {shallow} from 'enzyme';
import DynamicElement from './DynamicElement';

describe('DynamicElement', () => {
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
        misc: {
            fields: [
                {
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
                },
                {
                    id: 'name',
                    name: 'name',
                    type: 'text',
                    label: 'Name',
                },
            ],
            idAttribute: 'name',
        },
        label: 'Type',
        dynamic: true,
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
            <DynamicElement values={{...value}} elementsSchema={elementSchema} onKeysChanged={onChange} form={form} />
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a NexusEntity Component', () => {
        expect(wrapper.find('NexusEntity')).toHaveLength(1);
    });
});
