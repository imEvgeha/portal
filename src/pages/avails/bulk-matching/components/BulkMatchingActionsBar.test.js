import React from 'react';
import {shallow} from 'enzyme';
import BulkMatchingActionsBar from './BulkMatchingActionsBar';
import Button, {ButtonGroup} from '@atlaskit/button';

describe('BulkMatchingActionsBar', () => {
    let wrapper = null;

    beforeAll(() => {
        wrapper = shallow(<BulkMatchingActionsBar />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders button group wrapper', () => {
        expect(wrapper.find('.nexus-c-bulk-actions-bar')).toHaveLength(1);
    });

    it('renders button group element', () => {
        expect(wrapper.find(ButtonGroup)).toHaveLength(1);
    });

    it('renders 3 buttons, Cancel, Match and Match & Create', () => {
        expect(wrapper.find(Button)).toHaveLength(3);
    });
});
