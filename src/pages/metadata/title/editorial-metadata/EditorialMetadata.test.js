import React from 'react';
import {shallow} from 'enzyme';

import EditorialMetadata from './EditorialMetadata';

describe('EditorialMetadata', () => {
    let wrapper;
    it('should match snapshot', () => {
        wrapper = shallow(
            <EditorialMetadata />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
