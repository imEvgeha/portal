import React from 'react';
import {shallow} from 'enzyme';
import {SyncLogTable} from './SyncLogTable';

describe('SyncLogTable', () => {
    let wrapper = null;
    let spy = null;
    const props = {
        setDateTo: () => null,
        setDateFrom: () => null,
        dateTo: '',
        dateFrom: '',
    };
    beforeAll(() => {
        const mockDate = new Date('2020-07-11');
        spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    });

    afterAll(() => {
        spy.mockRestore();
    });

    beforeEach(() => {
        wrapper = shallow(<SyncLogTable {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render NexusDrawer', () => {
        expect(wrapper.find('NexusDrawer').length).toEqual(1);
    });
});
