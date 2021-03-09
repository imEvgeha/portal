import React from 'react';
import {shallow} from 'enzyme';
import * as Redux from 'react-redux';
import FulfillmentOrder from './FulfillmentOrder';

describe('FulfillmentOrder', () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    const useSelectorSpy = jest.spyOn(Redux, 'useSelector');
    const useDispatchSpy = jest.spyOn(Redux, 'useDispatch');

    useStateSpy.mockImplementation(init => [init, setState]);
    useSelectorSpy.mockReturnValue({});
    useDispatchSpy.mockImplementation(() => cb => cb);

    describe('HTML content', () => {
        const selectedFulfillmentOrder = {
            fulfillmentOrderId: 'VU000134567-001',
            dueDate: '2020-05-07T00:00:00-07:00',
            status: 'Completed',
            notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            billTo: 'MGM',
            rateCard: 'MGM Rate Card',
            servicer: 'DETE',
            priority: '10',
            startDate: '2020-04-07T00:00:00-07:00',
            completed_date: "2020-05-07T00:00:00-07:00",
            late_reason: "The dog ate my homework",
            late: true,
            late_fault: "Everyone is at fault",
            premiering: false,
            watermark: true,
            market_type: "Major",
            car: "Not sure what is this field"
        };

        const wrapper = shallow(<FulfillmentOrder selectedFulfillmentOrder={selectedFulfillmentOrder} />);
        it('should be FulfillmentOrder', () => {
            expect(wrapper.is(FulfillmentOrder));
        });

        it('should find 3 dates field', () => {
            expect(wrapper.find('.nexus-fo-date-readonly').length).toEqual(3)
        })

        it('should render header title', () => {
            expect(wrapper.find('.fulfillment-order__title--text').text()).toEqual('Fulfillment Order');
        });

        it('should match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });

    });

    describe('client to server fulfillment order transformation function', () => {
        it('should correctly transform a client FO structure to a server FO structure', () => {
            const client = {
                definition: {
                    id: 'test',
                },
            };
            const server = {
                definition: {id: 'test'},
            };

            expect(client).toEqual(server);
        });
    });
});
