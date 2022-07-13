import React from 'react';
import {shallow} from 'enzyme';
import AddRowDataItem from './AddRowDataItem';

describe('AddRowDataItem', () => {
    let wrapper = null;
    const props = {
        schema: {
            header: 'Add Licensor',
            triggerBtnLabel: '+ Add Licensor',
            valuesPath: 'licensor',
            uniqueByField: 'licensor',
            duplicationErrorMessage: 'Licensor already exists!',
            fields: [
                {
                    sections: [
                        {
                            fields: {
                                licensor: {
                                    stackLabel: true,
                                    name: 'Licensor',
                                    path: 'licensor',
                                    type: 'select',
                                    inModal: true,
                                    outputMap: {
                                        id: 'id',
                                        licensor: 'name',
                                    },
                                    optionsConfig: {
                                        defaultValuePath: 'id',
                                        defaultLabelPath: 'name',
                                    },
                                    isRequired: true,
                                },
                            },
                        },
                    ],
                },
            ],
        },
        selectValues: [],
        onAddRowDataItem: () => {},
        closeModal: () => {},
    };

    beforeEach(() => {
        wrapper = shallow(<AddRowDataItem {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
