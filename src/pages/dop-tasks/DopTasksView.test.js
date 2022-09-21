import React from 'react';
import {shallow} from 'enzyme';
import {DopTasksView} from './DopTasksView';

describe('DopTasksView', () => {
    let wrapper = null;
    let dopTasksHeader = null;
    let dopTasksTable = null;
    let queuedTasks = null;
    const refreshGridDataMock = jest.fn();

    const props = {
        toggleRefreshGridData: refreshGridDataMock,
    };

    beforeEach(() => {
        wrapper = shallow(<DopTasksView {...props} />);
        dopTasksTable = wrapper.find('DopTasksTable');
        queuedTasks = wrapper.find('QueuedTasks');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render DopTasksTable', () => {
        expect(dopTasksTable.length).toEqual(1);
    });

    it('should render QueuedTasks', () => {
        expect(queuedTasks.length).toEqual(1);
    });
});
