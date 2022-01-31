import React from 'react';
import {shallow} from 'enzyme';
import ToastWithLink from './ToastWithLink';

describe('WarningToastWithConfirmation', () => {
    let wrapper = null;

    beforeAll(() => {
        wrapper = shallow(<ToastWithLink />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render main container', () => {
        expect(wrapper.find('.nexus-c-bulk-success-toast-container')).toHaveLength(1);
    });

    it('should render icon', () => {
        expect(wrapper.find('.nexus-c-bulk-success-toast-icon')).toHaveLength(1);
    });

    it('should render link', () => {
        expect(wrapper.find('.nexus-c-bulk-success-toast-link')).toHaveLength(1);
    });
});
