import React from 'react';
import {shallow} from 'enzyme';
import {NexusBulkDelete} from './NexusBulkDelete';
import {BULK_DELETE_REMAINING_MSG} from './constants';

describe('NexusBulkDelete', () => {
    let wrapper = null;

    const props = {
        rightsWithDeps: {
            right123: {
                original: {
                    id: 'right123',
                    title: 'title1',
                    status: 'Merged',
                    rightStatus: 'Pending',
                    licensed: true,
                    sourceRightId: null,
                    originalRightIds: [],
                },
                isSelected: true,
                dependencies: [
                    {
                        id: 'right1234',
                        title: 'title12',
                        status: 'Merged',
                        rightStatus: 'Pending',
                        licensed: true,
                        sourceRightId: null,
                        originalRightIds: ['right123'],
                    },
                ],
            },
        },
        deletedRightsCount: 2,
    };

    beforeEach(() => {
        wrapper = shallow(<NexusBulkDelete {...props} />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('displays bulk delete remaining rights to delete message', () => {
        expect(wrapper.find('.nexus-c-bulk-delete__message').text()).toEqual(
            BULK_DELETE_REMAINING_MSG(props.deletedRightsCount, Object.keys(props.rightsWithDeps).length)
        );
    });

    it('renders BulkDeleteActions bar', () => {
        expect(wrapper.find('BulkDeleteActions')).toHaveLength(1);
    });
});
