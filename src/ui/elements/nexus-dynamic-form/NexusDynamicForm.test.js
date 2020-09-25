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

    it('should render tab container and all tabs within', () => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log(wrapper.debug());
        console.log(wrapper);

        const tabs = schema.map(({title = ''}) => title);
        const tabContainer = wrapper.find('.nexus-c-dynamic-form__tab-container');
        expect(tabContainer.length).toEqual(1); // Container exists

        expect(tabContainer.children().length).toEqual(tabs.length); // Container has all tabs

        tabContainer.children().forEach((child, index) => {
            expect(child.dive().text()).toEqual(tabs[index]); // All tabs are named properly
        });
    });

    it('should render a form', () => {
        const form = wrapper.find(AKForm);
        expect(form.length).toEqual(1);
    });
});
