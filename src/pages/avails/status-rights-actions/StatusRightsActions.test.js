import React from 'react';
import {shallow} from 'enzyme';
import {StatusRightsActions} from './StatusRightsActions';


describe('StatusRightsActions', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(
            <StatusRightsActions />
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render status actions wrapper', () => {
        expect(wrapper.find('.nexus-c-status-rights-actions')).toHaveLength(1);
    });

    it('should render status action item', () => {
        expect(wrapper.find('.nexus-c-status-rights-actions__menu-item')).toHaveLength(1);
    });
});