import React from 'react';
import {shallow} from 'enzyme';
import NexusPersonsList from './NexusPersonsList';

describe('NexusPersonsList', () => {
    let wrapper = null;
    const personsList = [
        {
            id: 'prs_Ac9oyaREip',
            firstName: null,
            middleName: null,
            lastName: null,
            displayName: 'Amaka Obi',
            personType: 'Actor',
            characterName: null,
        },
        {
            id: 'prs_airo586ETR',
            firstName: null,
            middleName: null,
            lastName: null,
            displayName: 'Ebube Nwagbo',
            personType: 'Actor',
            characterName: null,
        },
        {
            id: 'prs_x9TX5AkETo',
            firstName: null,
            middleName: null,
            lastName: null,
            displayName: 'Solomon Akiyesi',
            personType: 'Actor',
            characterName: null,
        },
    ];
    it('should match snapshot', () => {
        wrapper = shallow(<NexusPersonsList personsList={personsList} hasCharacter />);
        expect(wrapper).toMatchSnapshot();
    });
});
