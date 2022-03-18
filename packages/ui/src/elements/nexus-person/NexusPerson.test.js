import React from 'react';
import {shallow} from 'enzyme';
import {uid} from 'react-uid';
import NexusPerson from './NexusPerson';

describe('NexusPerson', () => {
    let wrapper = null;
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
            <NexusPerson
                key={uid(person.id, index)}
                person={person}
                index={index}
                hasCharacter
                showPersonType
                onRemove={() => null}
                onEditCharacter={() => null}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
