import React from 'react';
import {shallow} from 'enzyme';
import EmphasizedStringCellRenderer from './EmphasizedStringCellRenderer';

describe('EmphasizedStringCellRenderer', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<EmphasizedStringCellRenderer value={'IN PROGRESS'}/>);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should capitalize first letter in every word of value', () => {
        const cellRenderer = wrapper.find('.nexus-c-emphasized-string-cell-renderer');
        expect(cellRenderer.text()).toEqual('In Progress');
    });

    it('should apply proper coloring for given value', () => {
        const cellRenderer = wrapper.find('.nexus-c-emphasized-string-cell-renderer--is-teal');
        expect(cellRenderer.exists()).toBeTruthy();
    });
});
