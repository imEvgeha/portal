import {shallow} from 'enzyme';
import React from 'react';
import {SORT_DIRECTION} from '../filter-section/constants';
import HeaderSection from './HeaderSection';

describe('HeaderSection', () => {
    describe('HTML content', () => {
        const serviceOrder = {
            soID: '12345',
            customer: 'Paramount',
            creationDate: '10/09/2020',
            createdBy: 'John Wick',
            fulfillmentOrders: [
                {
                    fulfillmentOrderId: 'VU000134567-001',
                    external_id: 'VU000134567-001',
                    dueDate: '10/05/2021',
                    definition: {
                        dueDate: '10/05/2021'
                    },
                    status: 'COMPLETED',
                    product_description: 'Movie1'
                },
                {
                    fulfillmentOrderId: 'VU000134597-002',
                    external_id: 'VU000134597-002',
                    dueDate: '09/05/2021',
                    definition: {
                        dueDate: '09/05/2021'
                    },
                    status: 'PENDING',
                    product_description: 'Movie2'
                },
                {
                    fulfillmentOrderId: 'VU000134597-003',
                    external_id: 'VU000134597-003',
                    dueDate: '11/05/2021',
                    definition: {
                        dueDate: '11/05/2021'
                    },
                    status: 'PENDING',
                    product_description: 'Movie3'
                }
            ]
        };

        const wrapper = shallow(<HeaderSection orderDetails={serviceOrder} />);

        it('should render header title', () => {
            expect(wrapper.find('.panel-header__title--text').text()).toEqual('Servicing Order');
        });

        it('should have a Link component with link to servicing-orders page', () => {
            expect(wrapper.find('Link').length).toEqual(1);
            expect(wrapper.find('Link').props().to).toEqual('/servicing-orders');
        });

        it('should render 3 FulfillmentOrderPanel components', () => {
            expect(wrapper.find('FulfillmentOrderPanel').length).toEqual(3);
        });

        it('should find filter element', () => {
            expect(wrapper.find('.panel-header__filter').length).toEqual(1);
        });

        it('does not sort by default', () => {
            wrapper.find('ServiceOrderFilter').prop('setDueDateSortDirection')(SORT_DIRECTION[0]);
            const dueDates = wrapper.find('FulfillmentOrderPanel').map(node => node.props().dueDate);
            
            expect(dueDates).toEqual(['2021-10-05', '2021-09-05', '2021-11-05']);
        });

        it('sorts FulfillmentOrderPanel components by ascending due dates correctly', () => {
            wrapper.find('ServiceOrderFilter').prop('setDueDateSortDirection')(SORT_DIRECTION[1]);
            const dueDates = wrapper.find('FulfillmentOrderPanel').map(node => node.props().dueDate);

            expect(dueDates).toEqual(['2021-09-05', '2021-10-05', '2021-11-05']);
        });

        it('sorts FulfillmentOrderPanel components by descending due dates correctly', () => {
            wrapper.find('ServiceOrderFilter').prop('setDueDateSortDirection')(SORT_DIRECTION[2]);
            const dueDates = wrapper.find('FulfillmentOrderPanel').map(node => node.props().dueDate);

            expect(dueDates).toEqual(['2021-11-05', '2021-10-05', '2021-09-05']);
        });

        it('renders FulfillmentOrderPanel components with correct product_descriptions', () => {
            const wrapper = shallow(<HeaderSection orderDetails={serviceOrder} />);
            const productDescriptions = wrapper
                .find('FulfillmentOrderPanel')
                .map(node => node.props().productDescription);

            expect(productDescriptions).toEqual(['Movie1', 'Movie2', 'Movie3']);
        });
    });
});
