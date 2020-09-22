import React from 'react';
import {shallow} from 'enzyme';
import {withHooks} from 'jest-react-hooks-shallow';
import {GRID_EVENTS} from '../../ui/elements/nexus-grid/constants';
import EventManagement from './EventManagement';

describe('EventManagement', () => {
    let wrapper = null;
    let eventManagementTableWrapper = null;
    const historyPushMockFn = jest.fn();
    const substringMockFn = jest.fn();

    beforeEach(() => {
        wrapper = shallow(
            <EventManagement history={{push: historyPushMockFn}} location={{search: {substring: substringMockFn}}} />
        );
        eventManagementTableWrapper = wrapper.find('Connect(EventManagementTable)');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render header title', () => {
        expect(wrapper.find('.nexus-c-event-management .nexus-c-event-management__title').text()).toEqual(
            'Event Management'
        );
    });

    it('should render EventManagementTable', () => {
        expect(eventManagementTableWrapper.length).toEqual(1);
    });

    describe('EventDrawer (gridApi)', () => {
        const {READY, SELECTION_CHANGED, FILTER_CHANGED} = GRID_EVENTS;
        const event = {eventId: '123', id: 'abc'};
        const filter = {
            tenantId: {
                filter: 'WB',
                filterType: 'text',
                type: 'equals',
            },
        };
        const sort = [
            {
                colId: 'tenantId',
                sort: 'asc',
            },
        ];

        const deselectAllMock = jest.fn();
        const setFilterModelMock = jest.fn();
        const setSortModelMock = jest.fn();
        const gridApiMock = {
            deselectAll: deselectAllMock,
            getSelectedRows: () => [event],
            sizeColumnsToFit: () => null,
            getFilterModel: () => filter,
            getSortModel: () => sort,
            setFilterModel: setFilterModelMock,
            setSortModel: setSortModelMock,
        };

        const afterUseEffectWrapper = () => {
            withHooks(() => {
                wrapper = shallow(
                    <EventManagement
                        history={{push: historyPushMockFn}}
                        location={{search: {substring: substringMockFn}}}
                    />
                );
            });
        };

        beforeEach(() => {
            eventManagementTableWrapper.props().onGridEvent({type: READY, api: gridApiMock});
            eventManagementTableWrapper.props().onGridEvent({type: SELECTION_CHANGED, api: gridApiMock});
            wrapper.update();
        });

        afterEach(() => {
            deselectAllMock.mockReset();
            setFilterModelMock.mockReset();
            setSortModelMock.mockReset();
        });

        it('should render EventDrawer', async () => {
            expect(wrapper.find('EventDrawer').length).toEqual(1);
        });

        it('should set api on grid event and passes correct prop to EventDrawer', async () => {
            await setTimeout(() => {
                expect(wrapper.find('EventDrawer').props().event).toEqual(event);
            }, 1000);
        });

        it('should correct prop to close drawer in EventDrawer', async () => {
            await setTimeout(() => {
                wrapper.find('EventDrawer').props().onDrawerClose();
                expect(deselectAllMock.mock.calls.length).toEqual(1);
            }, 1000);
        });

        it('should update the URL with the applied filter', () => {
            eventManagementTableWrapper.props().onGridEvent({type: FILTER_CHANGED, api: gridApiMock});
            wrapper.update();
            expect(historyPushMockFn).toHaveBeenCalledWith({
                search:
                    '?filter=%7B%22tenantId%22%3A%7B%22filter%22%3A%22WB%22%2C%22filterType%22%3A%22text%22%2C%22type%22%3A%22equals%22%7D%7D',
            });
        });

        it('should update the URL with the applied sort option', () => {
            eventManagementTableWrapper.props().onSortChanged({api: gridApiMock});
            wrapper.update();
            expect(historyPushMockFn).toHaveBeenCalledWith({
                search: '?sort=%5B%7B%22colId%22%3A%22tenantId%22%2C%22sort%22%3A%22asc%22%7D%5D',
            });
        });

        it('should correctly apply the filters and sorts given in the URL search params', () => {
            substringMockFn.mockImplementationOnce(
                () =>
                    'filter=%7B%22tenantId%22%3A%7B%22filter%22%3A%22WB%22%2C%22filterType%22%3A%22text%22%2C%22type%22%3A%22equals%22%7D%7D&sort=%5B%7B%22colId%22%3A%22tenantId%22%2C%22sort%22%3A%22asc%22%7D%5D'
            );
            wrapper.setProps({location: {search: {substring: substringMockFn}}});
            eventManagementTableWrapper.props().onGridEvent({type: READY, api: gridApiMock});
            wrapper.update();
            expect(setFilterModelMock).toHaveBeenCalledWith(filter);
            expect(setSortModelMock).toHaveBeenCalledWith(sort);
        });

        it('should correctly set the selectedEventId as a URL param', async () => {
            eventManagementTableWrapper.props().onGridEvent({type: SELECTION_CHANGED, api: gridApiMock});
            wrapper.update();
            expect(historyPushMockFn).toHaveBeenCalledWith({
                search: '?selectedEventId=%22abc%22',
            });
        });

        it('opens the event drawer given a selectedEventId in the URL search params', async () => {
            substringMockFn.mockImplementationOnce(() => 'selectedEventId=%22test_event_id%22');
            await afterUseEffectWrapper();
            expect(wrapper.find('EventDrawer').props().id).toEqual('test_event_id');
        });
    });
});
