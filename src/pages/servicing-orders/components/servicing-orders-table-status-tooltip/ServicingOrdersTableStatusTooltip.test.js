import React from 'react';
import {shallow} from 'enzyme';
import {withHooks} from 'jest-react-hooks-shallow';
import {servicingOrdersService} from '../../servicingOrdersService';
import ServicingOrdersTableStatusTooltip from './ServicingOrdersTableStatusTooltip';

const mockServiceCall = jest.fn();
const mockServiceCallResolve = resolveWith =>
    mockServiceCall.mockImplementationOnce(() => new Promise(resolve => resolve(resolveWith)));
const mockServiceCallReject = () =>
    mockServiceCall.mockImplementationOnce(
        () => new Promise((resolve, reject) => reject(new Error('this is a problem')))
    );

jest.mock('../../servicingOrdersService.js', () => ({
    ...jest.requireActual('../../servicingOrdersService.js'),
    servicingOrdersService: {
        getFulfilmentOrdersForServiceOrder: jest.fn(),
    },
}));

jest.mock('../../../../util/Common.js', () => ({
    ...jest.requireActual('../../../../util/Common.js'),
    URL: {
        ...jest.requireActual('../../../../util/Common.js').URL,
        isLocalOrDevOrQA: jest.fn().mockImplementation(() => true),
    },
}));

describe('ServicingOrdersTableStatusTooltip', () => {
    let wrapper = null;
    const props = {
        soNumber: '1234567890',
    };
    servicingOrdersService.getFulfilmentOrdersForServiceOrder = mockServiceCall;

    const afterUseEffectWrapper = () => {
        withHooks(() => {
            wrapper = shallow(<ServicingOrdersTableStatusTooltip {...props} />);
        });
    };

    it('should match the loading snapshot - should have spinner', () => {
        wrapper = shallow(<ServicingOrdersTableStatusTooltip {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should match the StatusTooltip snapshot - should have tooltip', async () => {
        mockServiceCallResolve({fulfillmentOrders: []});
        await afterUseEffectWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    it('should display a loader initially', async () => {
        wrapper = shallow(<ServicingOrdersTableStatusTooltip {...props} />);
        expect(wrapper.find('Spinner')).toBeTruthy();
    });

    it('should display -No fulfillment orders were found.- if an error is thrown', async () => {
        mockServiceCallReject();
        await afterUseEffectWrapper();
        expect(wrapper.text()).toContain('No fulfillment orders were found.');
    });

    it('should display the StatusTooltip if there are no errors', async () => {
        mockServiceCallResolve({fulfillmentOrders: []});
        await afterUseEffectWrapper();
        expect(wrapper.find('.nexus-c-cervicing-orders-table-status-tooltip__fields')).toBeTruthy();
    });

    it('should display the 6 tags and the correct values', async () => {
        mockServiceCallResolve({
            fulfillmentOrders: [
                {
                    status: 'NOT_STARTED',
                },
                {
                    status: 'NOT_STARTED',
                },
                {
                    status: 'IN_PROGRESS',
                },
                {
                    status: 'COMPLETE',
                },
                {
                    status: 'CANCELLED',
                },
                {
                    status: 'COMPLETE',
                },
                {
                    status: 'FAILED',
                },
                {
                    status: 'ON_HOLD',
                },
                {
                    status: 'FAILED',
                },
                {
                    status: 'NOT_STARTED',
                },
                {
                    status: 'NOT_STARTED',
                },
                {
                    status: 'NOT_STARTED',
                },
            ],
        });

        await afterUseEffectWrapper();

        const labels = wrapper.find('.nexus-c-servicing-orders-table-status-tooltip__field--label');
        expect(labels).toHaveLength(6);
        const values = wrapper.find('.nexus-c-servicing-orders-table-status-tooltip__field--value');
        expect(values).toHaveLength(6);

        expect(labels.at(0).text()).toEqual('Not Started');
        expect(values.at(0).text()).toEqual('5');

        expect(labels.at(1).text()).toEqual('In Progress');
        expect(values.at(1).text()).toEqual('1');

        expect(labels.at(2).text()).toEqual('On Hold');
        expect(values.at(2).text()).toEqual('1');

        expect(labels.at(3).text()).toEqual('Complete');
        expect(values.at(3).text()).toEqual('2');

        expect(labels.at(4).text()).toEqual('Canceled');
        expect(values.at(4).text()).toEqual('1');

        expect(labels.at(5).text()).toEqual('Failed');
        expect(values.at(5).text()).toEqual('2');
    });
});
