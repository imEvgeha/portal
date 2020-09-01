import React from 'react';
import {shallow} from 'enzyme';
import {BulkDelete} from './BulkDelete';

describe('BulkDelete', () => {
    let wrapper = null;

    const props = {
        rightsWithDeps: {
            right123: {
                id: 1,
                title: 'title1',
                status: 'Merged',
                rightStatus: 'Pending',
                licensed: true,
            },
            right345: {
                id: 2,
                title: 'title12',
                status: 'ReadyNew',
                rightStatus: 'Pending',
                licensed: false,
            },
        },
    };

    beforeEach(() => {
        wrapper = shallow(<BulkDelete {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders Cancel nad Mark as Deleted buttons', () => {
        expect(wrapper.find('BulkDeleteActions')).toHaveLength(1);
    });
});
