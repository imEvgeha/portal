import React from 'react';
import {shallow} from 'enzyme';
import ServicingOrder from './ServicingOrder';
import HeaderSection from './components/header-section/HeaderSection';

describe('ServicingOrder', () => {
    describe('service section with async data fetch', () => {
        const promise = new Promise((resolve, reject) =>
            setTimeout(
                () =>
                    resolve({
                        data: {
                            'soID': '123',
                            'customer': 'MGM',
                            'orderId': 'order123',
                            'creationDate': '10/09/2020',
                            'createdBy': 'John Wick',
                            'fulfillmentOrders': [
                                {
                                    'fulfillmentOrderId': 'VU000134567-001',
                                    'dueDate': '10/05/2021',
                                    'status': 'Completed',
                                    'notes': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                                    'billTo': 'MGM',
                                    'rateCard': 'MGM Rate Card',
                                    'servicer': 'DETE',
                                    'recipient': 'QuanVision',
                                    'startDate': '07/05/2021'
                                },
                                {
                                    'fulfillmentOrderId': 'VU000134597-002',
                                    'dueDate': '09/05/2021',
                                    'status': 'Pending',
                                    'notes': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                                    'billTo': 'WB',
                                    'rateCard': 'WB Rate Card',
                                    'servicer': 'DETE2',
                                    'recipient': 'QuanVision2',
                                    'startDate': '07/05/2021'
                                }
                            ]
                        },
                    }),
                100
            )
        );
        const wrapper = shallow(<ServicingOrder />);
        it('should render header section', () => {
            expect(wrapper.find('.servicing-order__left').length).toEqual(1);
        });
        it('should render right section', () => {
            expect(wrapper.find('.servicing-order__right').length).toEqual(1);
        });
        expect(wrapper.find(HeaderSection).length).toEqual(0);
        promise.then(() => {
            expect(wrapper.find(HeaderSection).length).toEqual(1);
        });
    });
});
