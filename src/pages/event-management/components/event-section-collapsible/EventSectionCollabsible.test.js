import React from 'react';
import {shallow} from 'enzyme';
import EventSectionCollapsible from './EventSectionCollapsible';

describe('EventSectionCollapsible', () => {
    let wrapper = null;

    beforeAll(() => {
        wrapper = shallow(<EventSectionCollapsible isInitiallyOpen={false} />);
    });

    it('renders without crashing', () => {
        const wrapper = shallow(<EventSectionCollapsible />);
        expect(wrapper.containsMatchingElement(<div />)).toEqual(true);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have activator element', () => {
        const activatorClass = '.nexus-c-event-section-collapsible__activator';
        expect(wrapper.find(activatorClass)).toBeTruthy();
    });

    it('should have collapsible content', () => {
        const collapsibleClass = '.nexus-c-event-section-collapsible__content';
        expect(wrapper.find(collapsibleClass)).toBeTruthy();
    });

    it('should toggle collapsible container on activator click', () => {
        // click to expand
        wrapper.find('.nexus-c-event-section-collapsible__activator').simulate('click');
        const collapsibleContainerActive = wrapper.find('.nexus-c-event-section-collapsible__content');
        expect(collapsibleContainerActive.hasClass('nexus-c-event-section-collapsible__content--active')).toBeTruthy();
        // click to collapse
        wrapper.find('.nexus-c-event-section-collapsible__activator').simulate('click');
        const collapsibleContainerInactive = wrapper.find('.nexus-c-event-section-collapsible__content');
        expect(collapsibleContainerInactive.hasClass('nexus-c-event-section-collapsible__content--active')).toBeFalsy();
    });
});
