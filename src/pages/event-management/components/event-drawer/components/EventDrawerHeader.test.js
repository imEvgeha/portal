import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import EventDrawerHeader, {EventDrawerH} from './EventDrawerHeader';

describe('EventDrawerHeader', () => {
    let mockStore;
    let store;
    let onReplayEventMock;
    let wrapper;
    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore({});
        onReplayEventMock = jest.fn();
        const props = {
            store:store,
            event:{eventId: '123'},
            onReplay:onReplayEventMock
        };
        wrapper = shallow(
            <EventDrawerH
                {...props}
            />);
    });

    it('should render the component', () => {
        expect(wrapper).not.toBe(null);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should should call on replay when replay button clicked', () => {
        const replayButton = wrapper.find('.nexus-c-event-drawer-header__replay-button');
        expect(replayButton).toHaveLength(1);
        replayButton.simulate('click');
        // expect(onReplayEventMock).toHaveBeenCalled();
        expect(onReplayEventMock.mock.calls.length).toEqual(1);
    });
});