import React from 'react';
import {shallow} from 'enzyme';
import {EVENT_HEADER_MAIN_FIELDS, EVENT_HEADER_SECONDARY_FIELDS} from '../../eventManagementConstants';
import EventHeader from './EventHeader';

describe('EventHeader', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(
            <EventHeader
                event={{
                    eventId: 'string',
                    correlationId: 'string',
                    eventType: 'string',
                    eventSource: 'string',
                    tenantId: 'string',
                    objectId: 'string',
                    createdTimeStamp: 'string',
                    postedTimeStamp: 'string',
                    replyTo: 'string',
                    autoClassName: 'string',
                    eventClassName: 'string',
                    summary: 'string',
                }}
            />
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render all main fields', () => {
        expect(wrapper.find('.nexus-c-event-header__field').length).toEqual(EVENT_HEADER_MAIN_FIELDS.length);
    });

    it('should render all fields when secondary fields are revealed', () => {
        const toggle = wrapper.find('.nexus-c-event-header__secondary-fields-toggle');
        const fieldCount = EVENT_HEADER_MAIN_FIELDS.length + EVENT_HEADER_SECONDARY_FIELDS.length;

        expect(toggle).toHaveLength(1);
        toggle.simulate('click');
        expect(wrapper.find('.nexus-c-event-header__field').length).toEqual(fieldCount);
    });
});
