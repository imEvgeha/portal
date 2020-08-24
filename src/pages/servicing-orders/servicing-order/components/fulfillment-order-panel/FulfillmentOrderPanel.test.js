import React from 'react';
import {shallow} from 'enzyme';
import {SERVICERS} from '../../../constants';
import FulfillmentOrderPanel from './FulfillmentOrderPanel';

describe('FulfillmentOrderPanel', () => {
    let wrapper = null;
    let handleFulfillmentOrderChange = null;

    beforeEach(() => {
        handleFulfillmentOrderChange = jest.fn();

        const props = {
            handleFulfillmentOrderChange,
            id: 'VU000134567-001',
            dueDate: '10/05/2021',
            servicer: SERVICERS['DETE'],
            externalId: 'COVFEFE',
            status: 'COMPLETED',
            selected: false,
        };
        wrapper = shallow(<FulfillmentOrderPanel {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have a fulfillment-order-panel div and call setSelectedFulfillmentOrder when is clicked', () => {
        const fulfillmentOrderPanel = wrapper.find('.nexus-c-fulfillment-order-panel');
        expect(fulfillmentOrderPanel).toHaveLength(1);
        fulfillmentOrderPanel.simulate('click');
        expect(handleFulfillmentOrderChange).toHaveBeenCalled();
    });

    it('should have a servicer indicator', () => {
        const servicerElement = wrapper.find('.nexus-c-fulfillment-order-panel__servicer');
        expect(servicerElement).toHaveLength(1);
    });

    it('should handle the DETE case', () => {
        wrapper.setProps({
            handleFulfillmentOrderChange,
            id: 'VU000134567-001',
            dueDate: '10/05/2021',
            servicer: 'DETE',
            externalId: 'COVFEFE',
            status: 'COMPLETED',
            selected: false,
        });
        wrapper.update();
        const servicerNodeText = wrapper.find('.nexus-c-fulfillment-order-panel__servicer-label').text();
        expect(servicerNodeText).toBe('DETE');
    });

    it('should handle the CHOP case', () => {
        wrapper.setProps({
            handleFulfillmentOrderChange,
            id: 'VU000134567-001',
            dueDate: '10/05/2021',
            servicer: 'CHOP',
            externalId: 'COVFEFE',
            status: 'COMPLETED',
            selected: false,
        });
        wrapper.update();
        const servicerNodeText = wrapper.find('.nexus-c-fulfillment-order-panel__servicer-label').text();
        expect(servicerNodeText).toBe('CHOP');
    });

    it('should handle the JUICEBOX case', () => {
        wrapper.setProps({
            handleFulfillmentOrderChange,
            id: 'VU000134567-001',
            dueDate: '10/05/2021',
            servicer: 'JUICEBOX',
            externalId: 'COVFEFE',
            status: 'COMPLETED',
            selected: false,
        });
        wrapper.update();
        const servicerNodeText = wrapper.find('.nexus-c-fulfillment-order-panel__servicer-label').text();
        expect(servicerNodeText).toBe('JUICE BOX');
    });
});
