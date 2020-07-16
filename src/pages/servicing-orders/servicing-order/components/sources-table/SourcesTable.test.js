import React from 'react';
import {shallow} from 'enzyme';
import SourcesTable from './SourcesTable';
import {get} from 'lodash';
import * as data from '../../../servicingOrderMockData.json';
import {prepareRowData} from './util';

describe('SourcesTable without rows', () => {
    const wrapper = shallow(<SourcesTable data={[]} />);
    it('should render table title with count 0', () => {
        expect(wrapper.find('h2').text()).toEqual('Sources (0)');
    });
});

describe('SourceTable with rows', () => {
    const tableData = get(data, 'fulfillmentOrders', []).find(s => s && s.fulfillmentOrderId === 'VU000134567-001');
    it('Should match snapshot', () => {
        const wrapper = shallow(<SourcesTable data={prepareRowData(tableData)} onSelectedSourceChange={null} />);
        expect(wrapper).toMatchSnapshot();
    });
});
