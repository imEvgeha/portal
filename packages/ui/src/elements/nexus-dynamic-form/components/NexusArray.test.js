import React from 'react';
import {shallow} from 'enzyme';
import NexusArray from './NexusArray';

describe('NexusArray', () => {
    let wrapper = null;
    let setFieldValueMock;
    let closeModalMock;

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
        {
            country: 'US',
            selected: false,
            dateSelected: null,
            rightContractStatus: 'MatchedOnce',
            vuContractId: [],
            hide: null,
            comment: '',
            dateWithdrawn: null,
        },
    ];

    beforeEach(() => {
        setFieldValueMock = jest.fn();
        closeModalMock = jest.fn();
        const props = {
            name: 'territory',
            view: 'EDIT',
            data,
            fields,
            defaultValue: 'rght_zrp8g',
            getValues: () => {},
            setFieldValue: setFieldValueMock,
            closeModal: closeModalMock,
        };

        wrapper = shallow(<NexusArray {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render an add button when is in edit mode', () => {
        const nexusArray = wrapper.find('.nexus-c-array');
        expect(nexusArray.length).toEqual(1);
        const addBtn = wrapper.find('.nexus-c-array__add');
        expect(addBtn.length).toEqual(1);
    });

    it('should render 2 object with 2 fields each', () => {
        const nexusArrayObjects = wrapper.find('.nexus-c-array__object');
        expect(nexusArrayObjects.length).toEqual(2);

        const nexusArrayFields = wrapper.find('.array-field-wrapper');
        expect(nexusArrayFields.length).toEqual(4);
    });

    it('should render 2 remove buttons and onClick the field value should be updated', () => {
        const nexusRemoveButtons = wrapper.find('.nexus-c-array__remove-button');
        expect(nexusRemoveButtons.length).toEqual(2);
        nexusRemoveButtons.at(0).simulate('click');
        expect(setFieldValueMock.mock.calls.length).toEqual(1);
    });
});
