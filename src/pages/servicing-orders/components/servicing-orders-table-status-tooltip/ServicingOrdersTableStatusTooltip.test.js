import React from 'react';
import {shallow} from 'enzyme';
import ServicingOrdersTableStatusTooltip from './ServicingOrdersTableStatusTooltip';

describe('ServicingOrdersTableStatusTooltip', () => {
    let wrapper = null;
    let props;

    beforeEach(() => {
        props = {
            reportValues: {
                notStarted: 20001,
                inProgress: 1000,
                onHold: 1001,
                completed: 19999,
                canceled: 3,
                failed: 2,
            },
        };
        wrapper = shallow(<ServicingOrdersTableStatusTooltip {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should include an nexus-c-servicing-orders-table-status-tooltip and nexus-c-servicing-orders-table-status-tooltip__fields  div', () => {
        const ingestReport = wrapper.find('.nexus-c-servicing-orders-table-status-tooltip');
        expect(ingestReport).toHaveLength(1);
        const ingestReportFields = wrapper.find('.nexus-c-servicing-orders-table-status-tooltip__fields');
        expect(ingestReportFields).toHaveLength(1);
    });

    it('should include 6 tags and their values', () => {
        const labels = wrapper.find('.nexus-c-servicing-orders-table-status-tooltip__field--label');
        expect(labels).toHaveLength(6);
        const values = wrapper.find('.nexus-c-servicing-orders-table-status-tooltip__field--value');
        expect(values).toHaveLength(6);

        expect(labels.at(0).text()).toEqual('Not Started');
        expect(values.at(0).text()).toEqual('20001');

        expect(labels.at(1).text()).toEqual('In Progress');
        expect(values.at(1).text()).toEqual('1000');

        expect(labels.at(2).text()).toEqual('On Hold');
        expect(values.at(2).text()).toEqual('1001');

        expect(labels.at(3).text()).toEqual('Completed');
        expect(values.at(3).text()).toEqual('19999');

        expect(labels.at(4).text()).toEqual('Canceled');
        expect(values.at(4).text()).toEqual('3');

        expect(labels.at(5).text()).toEqual('Failed');
        expect(values.at(5).text()).toEqual('2');
    });

});
