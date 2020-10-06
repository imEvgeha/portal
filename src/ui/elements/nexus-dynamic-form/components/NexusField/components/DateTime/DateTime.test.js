import React from 'react';
import {shallow} from 'enzyme';
import DateTime from './DateTime';

describe('DateTime', () => {
    let wrapper = null;
    const props = {
        onChange: () => null,
    };
    beforeAll(() => {
        wrapper = shallow(<DateTime {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render NexusDateTimeWindowPicker when type is dateRange', () => {
        wrapper.setProps({type: 'dateRange'});
        expect(wrapper.find('NexusDateTimeWindowPicker').length).toEqual(1);
    });

    it('should render NexusDateTimePicker when dateType is businessDateTime', () => {
        wrapper.setProps({type: 'datetime', dateType: 'businessDateTime'});
        expect(wrapper.find('NexusDateTimePicker').length).toEqual(1);
    });

    it('should render NexusDatePicker when dateType is regional', () => {
        wrapper.setProps({type: 'datetime', dateType: 'regional'});
        expect(wrapper.find('NexusDatePicker').length).toEqual(1);
    });
});
