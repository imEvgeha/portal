import React from 'react';
import {shallow} from 'enzyme';
import {Action} from './Actions.class';
import EntityActions from './EntityActions';

describe('EntityActions', () => {
    let wrapper = null;

    const tag = 'Season';
    const flag1 = 'S3';
    const flag2 = 'E1';
    const actions = [
        new Action({
            icon: File,
            action: () => {},
            position: 5,
            disabled: false,
            buttonId: 'fileBtn',
        }),
    ];

    beforeEach(() => {
        wrapper = shallow(<EntityActions tag={tag} flag2={flag2} flag1={flag1} actions={actions} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a form', () => {
        expect(wrapper.find('.nexus-c-entity-actions')).toHaveLength(1);
    });
});
