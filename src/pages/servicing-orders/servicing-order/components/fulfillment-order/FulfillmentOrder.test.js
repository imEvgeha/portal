import React from 'react';
import {shallow, mount} from 'enzyme';
import * as Redux from 'react-redux';
import FulfillmentOrder from './FulfillmentOrder';
import { act } from 'react-dom/test-utils';


describe('FulfillmentOrder', () => {
    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    let useSelectorSpy = jest.spyOn(Redux, 'useSelector');
    let useDispatchSpy = jest.spyOn(Redux, 'useDispatch');

    useStateSpy.mockImplementation((init) => [init, setState]);
    useSelectorSpy.mockReturnValue({});
    useDispatchSpy.mockImplementation(() => (cb) => (cb));

    describe('HTML content', () => {
        const selectedFulfillmentOrder = {
            'fulfillmentOrderId': 'VU000134567-001',
            'dueDate': '10/05/2021',
            'status': 'Completed',
            'notes': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'billTo': 'MGM',
            'rateCard': 'MGM Rate Card',
            'servicer': 'DETE',
            'priority': '10',
            'startDate': '07/05/2021'
        };

        const wrapper = shallow(<FulfillmentOrder selectedFulfillmentOrder={selectedFulfillmentOrder} />);
        it('should be FulfillmentOrder', () => {
            expect(wrapper.is(FulfillmentOrder));
        });

        it('should render header title', () => {
            expect(wrapper.find('.fulfillment-order .fulfillment-order__title h1').text()).toEqual('Fulfillment Order');
        });

        it('should match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });
    });
});
