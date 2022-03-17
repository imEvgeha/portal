import React from 'react';
import {shallow} from 'enzyme';
import {Provider} from 'react-redux';
import {uid} from 'react-uid';
import configureStore from 'redux-mock-store';
import NexusPerson from './NexusPerson';

describe('NexusPerson', () => {
    let wrapper = null;
    const mockStore = configureStore();
    const store = mockStore({
        titleMetadata: {
            isEditorial: true,
        },
    });
    const person = {
        id: 'prs_Ac9oyaREip',
        firstName: null,
        middleName: null,
        lastName: null,
        displayName: 'Amaka Obi',
        personType: 'Actor',
        characterName: 'test2',
    };
    const index = 1;
    it('should match snapshot', () => {
        wrapper = shallow(
            <Provider store={store}>
                <NexusPerson
                    key={uid(person.id, index)}
                    person={person}
                    index={index}
                    hasCharacter
                    showPersonType
                    onRemove={() => null}
                    onEditCharacter={() => null}
                />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
