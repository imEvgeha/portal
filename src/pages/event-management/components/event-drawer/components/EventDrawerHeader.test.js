import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import EventDrawerHeader, {EventDrawerH} from './EventDrawerHeader';

describe('EventDrawerHeader', () => {
    let mockStore;
    let store;
    let onReplayEventMock;
    let onReplicateEventMock;
    let wrapper;
    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore({});
        onReplayEventMock = jest.fn();
        onReplicateEventMock = jest.fn();
        const props = {
            store,
            event: {eventId: '123'},
            onReplay: onReplayEventMock,
            onReplicate: onReplicateEventMock,
        };
        wrapper = shallow(
            <EventDrawerH
                {...props}
            />
        );
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
});
