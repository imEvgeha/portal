import React from 'react';
import {Field as AKField} from '@atlaskit/form';
import {shallow} from 'enzyme';
import NexusArray from './NexusArray';

describe('NexusArray', () => {
    let wrapper = null;
    const fields = {
        selected: {
            name: 'Selected',
            type: 'boolean',
            path: 'territory.selected',
            isReadOnly: true,
        },
        country: {
            name: 'Country',
            type: 'string',
            path: 'territory.country',
        },
    };

    const data = [
        {
            country: 'IL',
            selected: false,
            dateSelected: null,
            rightContractStatus: 'Pending',
            vuContractId: [],
            hide: null,
            comment: 'yyyyy',
            dateWithdrawn: null,
        },
    ];
    const props = {
        name: 'territory',
        view: 'EDIT',
        data,
        fields,
        defaultValue: 'rght_zrp8g',
        getValues: () => {},
    };

    beforeEach(() => {
        wrapper = shallow(<NexusArray {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render an add button when is in edit mode', () => {
        const nexusArray = wrapper.find('nexus-c-array');
        expect(nexusArray.length).toEqual(1);
        const addBtn = wrapper.find('nexus-c-array__add');
        expect(addBtn.length).toEqual(1);
    });
});
