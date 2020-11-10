import React from 'react';
import {Checkbox} from '@atlaskit/checkbox';
import {shallow} from 'enzyme';
import BulkDeleteSelectedRight from './BulkDeleteSelectedRight';

describe('BulkDeleteSelectedRight', () => {
    let wrapper = null;

    const props = {
        rightId: 'rightId_123',
        isSelected: true,
        title: 'Test Title avails 123',
    };
    beforeAll(() => {
        wrapper = shallow(<BulkDeleteSelectedRight {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders selected right container', () => {
        expect(wrapper.find('.nexus-c-bulk-delete-selected-right')).toHaveLength(1);
    });

    it('renders prop title', () => {
        expect(wrapper.find('.nexus-c-bulk-delete-selected-right__title').text()).toEqual(props.title);
    });

    it('renders selected right Checkbox', () => {
        expect(wrapper.find(Checkbox)).toHaveLength(1);
    });
});
