import React from 'react';
import {shallow} from 'enzyme';
import BulkDeleteAffectedRight from './BulkDeleteAffectedRight';

describe('BulkDeleteAffectedRight', () => {
    let wrapper = null;

    const props = {
        rightId: 'testId1',
        title: 'TestTitle',
        sourceRightId: 'testSourceId1',
        originalRightIds: ['testOriginalId2', 'testOriginalId2'],
    };
    beforeAll(() => {
        wrapper = shallow(<BulkDeleteAffectedRight {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders affected right container', () => {
        expect(wrapper.find('.nexus-c-bulk-delete-affected-right')).toHaveLength(1);
    });

    it('renders prop title', () => {
        expect(wrapper.find('.nexus-c-bulk-delete-affected-right__title').text()).toEqual(props.title);
    });
});
