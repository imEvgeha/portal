import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import AssignModal from './AssignModal';

describe('AssignModal', () => {
    let wrapper = null;

    beforeEach(() => {
        const mockStore = configureStore();
        const store = mockStore({
            dopTasks: {
                tasksOwners: [
                    {
                        firstName: 'test',
                        lastName: 'test',
                        userId: 'test',
                    },
                ],
            },
        });
        wrapper = shallow(<AssignModal store={store} />)
            .shallow()
            .shallow();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render Select with one option', () => {
        expect(wrapper.find('Dropdown').props().options.length).toEqual(1);
    });
});
