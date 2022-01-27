import React from 'react';
import {shallow} from 'enzyme';
import WarningToastWithConfirmation from './WarningToastWithConfirmation';

describe('WarningToastWithConfirmation', () => {
    let wrapper = null;

    beforeAll(() => {
        wrapper = shallow(<WarningToastWithConfirmation />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render main container', () => {
        expect(wrapper.find('.nexus-c-bulk-warning-toast-container')).toHaveLength(1);
    });

    it('should render buttons container', () => {
        expect(wrapper.find('.nexus-c-bulk-warning-toast-button-container')).toHaveLength(1);
    });
});
