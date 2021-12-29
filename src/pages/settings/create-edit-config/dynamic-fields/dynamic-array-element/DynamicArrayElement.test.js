import React from 'react';
import {shallow} from 'enzyme';
import DynamicArrayElement from './DynamicArrayElement';

describe('DynamicArrayElement', () => {
    let wrapper = null;
    const value = {};
    const form = {
        getValues: () => 'value',
    };
    const elementSchema = {
        id: 'territoryMetadata',
        name: 'territoryMetadata',
        type: 'array',
        label: 'Territory Metadata',
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
    };

    beforeEach(() => {
        wrapper = shallow(<DynamicArrayElement elementsSchema={elementSchema} form={form} values={value} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a row', () => {
        expect(wrapper.find('.row')).toHaveLength(1);
    });
});
