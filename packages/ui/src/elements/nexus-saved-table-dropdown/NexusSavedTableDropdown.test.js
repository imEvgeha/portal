import React from 'react';
import {shallow} from 'enzyme';
import NexusSavedTableDropdown from './NexusSavedTableDropdown';

describe('NexusSavedTableDropdown', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<NexusSavedTableDropdown />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
