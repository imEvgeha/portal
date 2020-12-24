import React from 'react';
import {shallow} from 'enzyme';
import {uid} from 'react-uid';
import NexusPersonRO from './NexusPersonRO';

describe('NexusPersonRO', () => {
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
    it('should match snapshot', () => {
        wrapper = shallow(<NexusPersonRO key={uid(person.id, 1)} person={person} showPersonType />);
        expect(wrapper).toMatchSnapshot();
    });
});
