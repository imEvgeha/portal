import React from 'react';
import {shallow} from 'enzyme';

import NexusDatePicker from './NexusDatePicker';

describe('NexusDatePicker', () => {
    it('should render', () => {
        const component = shallow(<NexusDatePicker onChange={() => null} id={''} />)
        expect(toJson(component)).toMatchSnapshot();
    });
});