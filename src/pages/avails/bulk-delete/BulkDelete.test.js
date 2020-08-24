import React from 'react';
import Button from '@atlaskit/button';
import {shallow} from 'enzyme';
import {BulkDelete} from './BulkDelete';

describe('BulkDelete', () => {
    let wrapper = null;

    const props = {
        rights: [
            {
                id: 1,
                title: 'title1',
                status: 'Merged',
                rightStatus: 'Pending',
                licensed: true,
            },
            {
                id: 2,
                title: 'title12',
                status: 'ReadyNew',
                rightStatus: 'Pending',
                licensed: false,
            },
        ],
    };

    beforeEach(() => {
        wrapper = shallow(<BulkDelete {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders Dynamic Table', () => {
        expect(wrapper.find('DynamicTable')).toHaveLength(1);
    });

    it('renders Cancel nad Mark as Deleted buttons', () => {
        expect(wrapper.find(Button)).toHaveLength(2);
    });
});
