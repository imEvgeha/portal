import React from 'react';
import {shallow} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import NexusDynamicForm from './NexusDynamicForm';

describe('NexusDynamicForm', () => {
    let wrapper = null;
    let store = null;
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
        const mockStore = configureStore();
        store = mockStore({});
        wrapper = shallow(
            <Provider store={store}>
                <NexusDynamicForm schema={schema} isEdit />
            </Provider>
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
