import React from 'react';
import {default as AKForm} from '@atlaskit/form';
import {shallow} from 'enzyme';
import NexusDynamicForm from './NexusDynamicForm';

describe('NexusDynamicForm', () => {
    let wrapper = null;
    const schema = [
        {
            title: 'Amazing Tab',
            sections: [
                {
                    title: 'Best section 2020',
                    fields: {
                        rightId: {
                            name: 'Right ID',
                            type: 'string',
                            path: 'id',
                            isReadOnly: true,
                            hiddenInCreate: true,
                        },
                    },
                },
            ],
        },
    ];

    beforeEach(() => {
        wrapper = shallow(<NexusDynamicForm schema={schema} isEdit />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a form', () => {
        const form = wrapper.find(AKForm);
        expect(form.length).toEqual(1);
    });
});
