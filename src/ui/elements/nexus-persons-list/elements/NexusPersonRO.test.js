import React from 'react';
import {shallow} from 'enzyme';

import NexusPersonRO from './NexusPersonRO';
import {uid} from 'react-uid';

describe('NexusPersonRO', () => {
    let wrapper;
    const person = {
        id: 'prs_Ac9oyaREip',
        firstName: null,
        middleName: null,
        lastName: null,
        displayName: 'Amaka Obi',
        personType: 'Actor',
        characterName: 'test2'
    };
    it('should match snapshot', () => {
        wrapper = shallow(
            <NexusPersonRO
                key={uid(person.id, 1)}
                person={person}
                showPersonType
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
});

