import React from 'react';
import {shallow} from 'enzyme';
import NexusUser from './NexusUser';

describe('NexusUser', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<NexusUser />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
