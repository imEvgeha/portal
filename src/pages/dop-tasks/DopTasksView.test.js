import React from 'react';
import {shallow} from 'enzyme';
import {DopTasksView} from './DopTasksView';

describe('DopTasksView', () => {
    let wrapper = null;
    let dopTasksHeader = null;
    let dopTasksTable = null;
    let queuedTasks = null;
    let refreshButton = null;
    const refreshGridDataMock = jest.fn();

    const props = {
        toggleRefreshGridData: refreshGridDataMock,
    };

    beforeEach(() => {
        wrapper = shallow(<DopTasksView {...props} />);
        dopTasksTable = wrapper.find('DopTasksTable');
        dopTasksHeader = wrapper.find('DopTasksHeader');
        queuedTasks = wrapper.find('QueuedTasks');
        refreshButton = wrapper.find('IconButton');
    });

    afterEach(() => {
        jest.clearAllMocks();
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

    it('should render QueuedTasks', () => {
        expect(queuedTasks.length).toEqual(1);
    });

    it('should render Refresh button', () => {
        expect(refreshButton.length).toEqual(1);
    });

    it('should dispatch refresh grid action', () => {
        refreshButton.simulate('click');
        expect(refreshGridDataMock).toHaveBeenCalled();
    });
});