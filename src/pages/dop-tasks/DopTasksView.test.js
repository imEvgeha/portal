import React from 'react';
import {shallow} from 'enzyme';
import DopTasksView from './DopTasksView';

describe('DopTasksView', () => {
    let wrapper = null;
    let dopTasksHeader = null;
    let dopTasksTable = null;

    beforeEach(() => {
        wrapper = shallow(<DopTasksView />);
        dopTasksTable = wrapper.find('DopTasksTable');
        dopTasksHeader = wrapper.find('DopTasksHeader');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render DopTasksHeader', () => {
        expect(dopTasksHeader.length).toEqual(1);
    });

    it('should render DopTasksTable', () => {
        expect(dopTasksTable.length).toEqual(1);
    });
});
