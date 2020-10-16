import React from 'react';
import {shallow} from 'enzyme';
import {get} from 'lodash';
import * as data from '../../../servicingOrderMockData.json';
import SourcesTable from './SourcesTable';
import {prepareRowData} from './util';

describe('SourcesTable without rows', () => {
    const wrapper = shallow(
        <SourcesTable
            data={[]}
            isDisabled={false}
            setUpdatedServices={() => null}
            onSelectedSourceChange={() => null}
        />
    );
    it('should render table title with count 0', () => {
        expect(wrapper.find('h2').text()).toEqual('Sources (0)');
    });
});

describe('SourceTable with rows', () => {
    // eslint-disable-next-line prefer-destructuring
    const tableData = data.servicingOrder.data.fulfillmentOrders[0];
    const wrapper = shallow(
        <SourcesTable
            data={prepareRowData(tableData)}
            onSelectedSourceChange={() => null}
            isDisabled={false}
            setUpdatedServices={() => null}
        />
    );
    it('Should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should not find add button', () => {
        const addButton = wrapper.find('.nexus-c-source-table__add-icon');
        expect(addButton).toHaveLength(0);
    });
});
