import React from 'react';
import {shallow} from 'enzyme';
import Button from '@atlaskit/button';
import StatusCheck from './StatusCheck';

describe('StatusCheck', () => {
    let wrapper = null;

    const props = {
        nonEligibleTitles: [{
            key: 1,
            cells: [
                {
                    key: 11,
                    content: 'Title',
                },
                {
                    key: 22,
                    content: 'Status',
                },
            ],
        }],
        message: 'Status Check Message',
    };

    beforeEach(() => {
        wrapper = shallow(
            <StatusCheck {... props} />
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render status check message', () => {
        expect(wrapper.find('.nexus-c-status-check__message').text()).toEqual('Status Check Message');
    });

    it('renders Dynamic Table', () => {
        expect(wrapper.find('DynamicTable')).toHaveLength(1);
    });

    it('renders OK button', () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});
