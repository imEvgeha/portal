import React from 'react';
import {shallow} from 'enzyme';
import ToastBody from './ToastBody';

describe('WarningToastWithConfirmation', () => {
    let wrapper = null;

    beforeAll(() => {
        wrapper = shallow(<ToastBody />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render main container', () => {
        expect(wrapper.find('.nexus-c-toast__container')).toHaveLength(1);
    });

    it('should render icon', () => {
        expect(wrapper.find('.nexus-c-toast__icon-container')).toHaveLength(1);
    });
});
