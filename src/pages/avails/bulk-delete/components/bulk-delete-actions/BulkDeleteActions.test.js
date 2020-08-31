import React from 'react';
import Button from '@atlaskit/button';
import {shallow} from 'enzyme';
import BulkDeleteActions from './BulkDeleteActions';

describe('BulkDeleteActions', () => {
    let wrapper = null;

    beforeAll(() => {
        wrapper = shallow(<BulkDeleteActions />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders Cancel and Delete buttons', () => {
        expect(wrapper.find(Button)).toHaveLength(2);
    });
});
