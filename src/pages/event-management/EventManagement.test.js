import React from 'react';
import {shallow} from 'enzyme';
import {GRID_EVENTS} from '../../ui/elements/nexus-grid/constants';
import EventManagement from './EventManagement';
import * as service from './eventManagementService';

describe('EventManagement', () => {
    let wrapper = null;
    let eventManagementTableWrapper = null;

    beforeEach(() => {
        wrapper = shallow(<EventManagement />);
        eventManagementTableWrapper = wrapper.find('Connect(EventManagementTable)');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render header title', () => {
        expect(wrapper.find('.nexus-c-event-management .nexus-c-event-management__title').text()).toEqual('Event Management');
    });

    it('should render EventManagementTable', () => {
        expect(eventManagementTableWrapper.length).toEqual(1);
    });

    describe('EventDrawer (gridApi)', () => {
        const {READY, SELECTION_CHANGED} = GRID_EVENTS;
        const event = {eventId: '123'};

        const deselectAllMock = jest.fn();
        const gridApiMock = {
            deselectAll: deselectAllMock,
            getSelectedRows: () => ([event]),
            sizeColumnsToFit: () => null,
        };

        const serviceMock = jest.spyOn(service, 'getEventById');
        serviceMock.mockImplementation(() => {
            return Promise.resolve({id: '123'});
        });

        beforeEach(() => {
            eventManagementTableWrapper.props().onGridEvent({type: READY, api: gridApiMock});
            eventManagementTableWrapper.props().onGridEvent({type: SELECTION_CHANGED, api: gridApiMock});
            wrapper.update();
        });

        afterEach(() => {
            deselectAllMock.mockReset();
        });


        it('should render EventDrawer', async () => {
            expect(serviceMock.mock.calls.length).toEqual(1);
            await setTimeout(() => {
                expect(wrapper.find('EventDrawer').length).toEqual(1);
            }, 1000);
        });

        it('should set api on grid event and passes correct prop to EventDrawer', async () => {
            await setTimeout(() => {
                expect(wrapper.find('EventDrawer').props().event).toEqual(event);
            }, 1000);
        });

        it('should correct prop to close drawer in EventDrawer', async () => {
            await setTimeout(() => {
                wrapper.find('EventDrawer').props()
                    .onDrawerClose();
                expect(deselectAllMock.mock.calls.length).toEqual(1);
            }, 1000);
        });
    });
});
