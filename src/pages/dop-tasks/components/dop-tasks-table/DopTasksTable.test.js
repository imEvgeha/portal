import React from 'react';
import {shallow} from 'enzyme';
import DopTasksTable from './DopTasksTable';

describe('DopTasksTable', () => {
    let wrapper = null;

    const props = {
        setExternalFilter: jest.fn(),
        setGridApi: jest.fn(),
        setColumnApi: jest.fn(),
        assignTasks: jest.fn(),
        unAssignTasks: jest.fn(),
        changePriority: jest.fn(),
    };

    beforeEach(() => {
        wrapper = shallow(<DopTasksTable {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render MoreIcon', () => {
        expect(wrapper.find('.nexus-c-dop-tasks-table__more-actions').length).toEqual(1);
    });
});
