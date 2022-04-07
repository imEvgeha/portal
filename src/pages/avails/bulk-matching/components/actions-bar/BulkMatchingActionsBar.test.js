import React from 'react';
import Button, {ButtonGroup, LoadingButton} from '@atlaskit/button';
import {shallow} from 'enzyme';
import BulkMatchingActionsBar from './BulkMatchingActionsBar';

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
        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('renders LoadingButton', () => {
        expect(wrapper.find(LoadingButton)).toHaveLength(2);
    });
});
