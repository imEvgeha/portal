import React from 'react';
import {shallow} from 'enzyme';
import RowDataItem from './RowDataItem';

describe('RowDataItem', () => {
    let wrapper = null;
    const props = {
        selectValues: [],
        data: [],
        firstColLbl: 'lbl1',
        firstColKey: '123',
        secondColLbl: 'lbl2',
        secondColKey: '456',
        canAdd: true,
        canDelete: true,
        onChange: () => {},
        addNewModalOptions: {triggerBtnLabel: 'Add new'},
    };

    beforeEach(() => {
        wrapper = shallow(<RowDataItem {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
