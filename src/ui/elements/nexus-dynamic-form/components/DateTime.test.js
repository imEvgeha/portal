import React from 'react';
import {shallow} from 'enzyme';
import DateTime from './DateTime';

describe('DateTime', () => {
    let wrapper = null;
    const props = {};
    beforeAll(() => {
        wrapper = shallow(<DateTime {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render NexusDateTimeWindowPicker', () => {
        expect(wrapper.find('NexusDateTimeWindowPicker').length).toEqual(1);
    });
});
