import React from 'react';
import {shallow} from 'enzyme';
import ModalContent from './ModalContent';

describe('ModalContent', () => {
    let wrapper = null;

    beforeAll(() => {
        wrapper = shallow(<ModalContent subtitle='Test' />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render modal container', () => {
        expect(wrapper.find('.nexus-c-modal-content')).toHaveLength(1);
    });

    it('should render modal subtitle container', () => {
        expect(wrapper.find('.nexus-c-modal-content__subtitle')).toHaveLength(1);
    });

    it('should render modal children', () => {
        expect(wrapper.find('.nexus-c-modal-content__fields')).toHaveLength(1);
    });
});
