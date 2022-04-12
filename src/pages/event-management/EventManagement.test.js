import React from 'react';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {shallow} from 'enzyme';
import {withHooks} from 'jest-react-hooks-shallow';
import {mockNavigate, mockSubstring} from '../../setupTestEnv';
import EventManagement from './EventManagement';

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
        const applyColumnStateMock = jest.fn();
        const gridApiMock = {
            deselectAll: deselectAllMock,
            getSelectedRows: () => [event],
            sizeColumnsToFit: () => null,
            getFilterModel: () => filter,
            setFilterModel: setFilterModelMock,
        };

        const columnApiMock = {
            getColumnState: () => sort,
            applyColumnState: applyColumnStateMock,
        };

        const afterUseEffectWrapper = () => {
            withHooks(() => {
                wrapper = shallow(<EventManagement />);
            });
        };

        beforeEach(() => {
            eventManagementTableWrapper.props().onGridEvent({type: READY, api: gridApiMock, columnApi: columnApiMock});
            eventManagementTableWrapper
                .props()
                .onGridEvent({type: SELECTION_CHANGED, api: gridApiMock, columnApi: columnApiMock});
            wrapper.update();
        });

        afterEach(() => {
            deselectAllMock.mockReset();
            setFilterModelMock.mockReset();
            applyColumnStateMock.mockReset();
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
            eventManagementTableWrapper
                .props()
                .onGridEvent({type: FILTER_CHANGED, api: gridApiMock, columnApi: columnApiMock});
            wrapper.update();
            expect(mockNavigate).toHaveBeenCalledWith({
                search: '?filter=%7B%22tenantId%22%3A%7B%22filter%22%3A%22WB%22%2C%22filterType%22%3A%22text%22%2C%22type%22%3A%22equals%22%7D%7D',
            });
        });

        it('should update the URL with the applied sort option', () => {
            eventManagementTableWrapper.props().onSortChanged({api: gridApiMock, columnApi: columnApiMock});
            wrapper.update();
            expect(mockNavigate).toHaveBeenCalledWith({
                search: '?sort=%5B%7B%22colId%22%3A%22tenantId%22%2C%22sort%22%3A%22asc%22%7D%5D',
            });
        });

        it('should correctly apply the filters and sorts given in the URL search params', () => {
            mockSubstring.mockImplementationOnce(
                () =>
                    'filter=%7B%22tenantId%22%3A%7B%22filter%22%3A%22WB%22%2C%22filterType%22%3A%22text%22%2C%22type%22%3A%22equals%22%7D%7D&sort=%5B%7B%22colId%22%3A%22tenantId%22%2C%22sort%22%3A%22asc%22%7D%5D'
            );
            wrapper.setProps({location: {search: {substring: mockSubstring}}});
            eventManagementTableWrapper.props().onGridEvent({type: READY, api: gridApiMock, columnApi: columnApiMock});
            wrapper.update();
            expect(setFilterModelMock).toHaveBeenCalledWith(filter);
            expect(applyColumnStateMock).toHaveBeenCalledWith({state: sort});
        });

        it('should correctly set the selectedEventId as a URL param', async () => {
            eventManagementTableWrapper
                .props()
                .onGridEvent({type: SELECTION_CHANGED, api: gridApiMock, columnApi: columnApiMock});
            wrapper.update();
            expect(mockNavigate).toHaveBeenCalledWith({
                search: '?selectedEventId=%22abc%22',
            });
        });

        it('opens the event drawer given a selectedEventId in the URL search params', async () => {
            mockSubstring.mockImplementationOnce(() => 'selectedEventId=%22test_event_id%22');
            await afterUseEffectWrapper();
            expect(wrapper.find('EventDrawer').props().id).toEqual('test_event_id');
        });
    });
});
