import React from 'react';
import {shallow} from 'enzyme';
import {Action} from './Actions.class';
import EntityActions from './EntityActions';

describe('EntityActions', () => {
    let wrapper = null;

    const tag = 'Season';
    const season = 'S3';
    const episode = 'E1';
    const actions = [
        new Action({
            icon: File,
            action: () => {},
            position: 6,
            disabled: false,
            buttonId: 'fileBtn',
        }),
    ];

    beforeEach(() => {
        wrapper = shallow(<EntityActions tag={tag} episode={episode} season={season} actions={actions} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a form', () => {
        expect(wrapper.find('.nexus-c-entity-actions')).toHaveLength(1);
    });
});
