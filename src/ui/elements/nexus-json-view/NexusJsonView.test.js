import React from 'react';
import {shallow} from 'enzyme';
import NexusJsonView from './NexusJsonView';

describe('NexusJsonView', () => {
    let wrapper = null;

    beforeEach(() => {
        const props = {
            src: {},
        };
        wrapper = shallow(<NexusJsonView {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with default height and width', () => {
        const nexusResizableElement = wrapper.find('NexusResizable');
        expect(nexusResizableElement.html()).toContain('width:100%');
        expect(nexusResizableElement.html()).toContain('height:250px');
    });

    it('should render with specified height and width', () => {
        wrapper.setProps({
            defaultWidth: 300,
            defaultHeight: 700,
        });
        wrapper.update();
        const nexusResizableElement = wrapper.find('NexusResizable');
        expect(nexusResizableElement.html()).toContain('width:300px');
        expect(nexusResizableElement.html()).toContain('height:700px');
    });
});
