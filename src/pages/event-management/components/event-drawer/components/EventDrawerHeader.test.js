import React from 'react';
import * as ability from '@vubiquity-nexus/portal-utils/lib/ability';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import {EventDrawerH} from './EventDrawerHeader';

jest.mock('@vubiquity-nexus/portal-utils/lib/ability');

describe('EventDrawerHeader', () => {
    let mockStore = null;
    let store = {};
    let onReplayEventMock = null;
    let onReplicateEventMock = null;
    let wrapper = null;
    let props = null;

    beforeEach(() => {
        ability.can.mockImplementation(() => true);
        mockStore = configureStore();
        store = mockStore({});
        onReplayEventMock = jest.fn();
        onReplicateEventMock = jest.fn();
        props = {
            store,
            event: {headers: {eventId: '123'}},
            onReplay: onReplayEventMock,
            onReplicate: onReplicateEventMock,
        };
        wrapper = shallow(<EventDrawerH {...props} />);
    });

    afterEach(() => {
        ability.can.mockClear();
    });

    it('should render the component', () => {
        expect(wrapper).not.toBe(null);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should should call onReplay when replay button clicked', () => {
        const replayButton = wrapper.find('.nexus-c-event-drawer-header__replay-button');
        expect(replayButton).toHaveLength(1);
        replayButton.simulate('click');
        expect(onReplayEventMock.mock.calls.length).toEqual(1);
    });

    it('should should call onReplicate when replicate button clicked', () => {
        const replicateButton = wrapper.find('.nexus-c-event-drawer-header__replicate-button');
        expect(replicateButton).toHaveLength(1);
        replicateButton.simulate('click');
        expect(onReplicateEventMock.mock.calls.length).toEqual(1);
    });

    it('disables the replicate and replay buttons if the user does not have correct permissions', () => {
        ability.can.mockImplementation(() => false);
        wrapper = shallow(<EventDrawerH {...props} />);

        const replayButton = wrapper.find('.nexus-c-event-drawer-header__replay-button');
        const replicateButton = wrapper.find('.nexus-c-event-drawer-header__replicate-button');

        expect(replayButton.html()).toContain('disabled');
        expect(replicateButton.html()).toContain('disabled');
    });

    it('enables the replicate and replay buttons if the user does have the correct permissions', () => {
        ability.can.mockImplementation(() => true);
        wrapper = shallow(<EventDrawerH {...props} />);

        const replayButton = wrapper.find('.nexus-c-event-drawer-header__replay-button');
        const replicateButton = wrapper.find('.nexus-c-event-drawer-header__replicate-button');

        expect(replayButton.html()).not.toContain('disabled');
        expect(replicateButton.html()).not.toContain('disabled');
    });
});
