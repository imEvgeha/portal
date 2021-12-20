import React from 'react';
import {shallow} from 'enzyme';
import NexusEntity from './NexusEntity';
import {Action} from './entity-actions/Actions.class';

describe('NexusEntity', () => {
    let wrapper = null;

    const heading = <h1>Heading</h1>;
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
        wrapper = shallow(
            <NexusEntity heading={heading} tag={tag} episode={episode} season={season} actions={actions} />
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a form', () => {
        expect(wrapper.find('.nexus-c-entity')).toHaveLength(1);
    });
});
