import React from 'react';
import {shallow} from 'enzyme';
import ServicingOrdersTableStatusBar from './ServicingOrdersTableStatusBar';

describe('ServicingOrdersTableStatusBar', () => {
    it('should match snapshot', () => {
        const wrapper = shallow(<ServicingOrdersTableStatusBar statusBarInfo={{totalRows: 5, selectedRows: 3}} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should show the selected row label if there are selected rows', () => {
        const wrapper = shallow(<ServicingOrdersTableStatusBar statusBarInfo={{totalRows: 5, selectedRows: 3}} />);
        const selectedRowsText = wrapper.find('.nexus-c-servicing-orders-table-status-bar__description').at(1).text();

        expect(selectedRowsText).toContain('Selected');
    });

    it('should not show the selected row label if there are no selected rows', () => {
        const wrapper = shallow(<ServicingOrdersTableStatusBar statusBarInfo={{totalRows: 5, selectedRows: 0}} />);
        const selectedRowsNode = wrapper.find('.nexus-c-servicing-orders-table-status-bar__description').at(1).length;

        expect(selectedRowsNode).toBeFalsy();
    });

    it('should show the correct number of total rows', () => {
        const wrapper = shallow(<ServicingOrdersTableStatusBar statusBarInfo={{totalRows: 55, selectedRows: 0}} />);
        const totalRowsText = wrapper.find('.nexus-c-servicing-orders-table-status-bar__description').at(0).text();

        expect(totalRowsText).toContain('55');
    });
});
