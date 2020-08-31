import React from 'react';
import {shallow} from 'enzyme';
import NexusDynamicForm from './NexusDynamicForm';

describe('NexusDynamicForm', () => {
    let wrapper = null;
    const mapping = [
        {
            title: 'Amazing Tab',
            sections: [
                {
                    title: 'Best section 2020',
                    fields: [
                        {
                            label: 'Awesome field',
                            type: 'text',
                        },
                    ],
                },
            ],
        },
    ];

    beforeEach(() => {
        wrapper = shallow(<NexusDynamicForm mapping={mapping}/>);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render tab container and all tabs within', () => {
        const tabs = mapping.map(({title = ''}) => title);
        const tabContainer = wrapper.find('.nexus-c-dynamic-form__tab-container');
        expect(tabContainer.length).toEqual(1); // Container exists

        expect(tabContainer.children().length).toEqual(tabs.length); // Container has all tabs

        tabContainer.children().forEach((child, index) => {
            expect(child.dive().text()).toEqual(tabs[index]); // All tabs are named properly
        })
    });
});
