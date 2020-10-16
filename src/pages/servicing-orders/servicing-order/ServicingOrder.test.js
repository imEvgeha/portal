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
                            configured_pr_id: 'pr_riEGi',
                            createdAt: '2020-05-25T18:09:41.614Z',
                            createdBy: null,
                            description: 'DEMO',
                            external_id: 'SR00001116',
                            id: 'so_riEGi',
                            notes: '',
                            readiness: 'NEW',
                            rush_order: '',
                            so_number: 'SO_0000000004',
                            sr_due_date: '2026-05-25T18:09:00.775Z',
                            status: 'NOT_STARTED',
                            submitted_by: '',
                            submitted_date: '',
                            tenant: 'MGM',
                            type: 'ServicingOrder',
                            updatedAt: '2020-05-25T18:09:41.614Z',
                            updatedBy: null,
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
        expect(wrapper.find(HeaderSection).length).toEqual(1);
        promise.then(() => {
            expect(wrapper.find(HeaderSection).length).toEqual(1);
        });
    });
});
