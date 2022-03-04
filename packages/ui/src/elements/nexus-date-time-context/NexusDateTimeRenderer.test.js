import React from 'react';
import {shallow} from 'enzyme';
import * as DateTimeContext from './NexusDateTimeProvider';
import DateTimeRenderer from './NexusDateTimeRenderer';

describe('NexusDateTimeRenderer', () => {
    let wrapper = null;

    const spy = jest.spyOn(DateTimeContext, 'useDateTimeContext');
    const mockUseDateTimeContextHook = (bool, mockRenderDateTimeFn = () => null) =>
        spy.mockImplementationOnce(() => ({
            isLocal: bool,
            setIsLocal: jest.fn(),
            renderDateTime: jest.fn(mockRenderDateTimeFn),
        }));

    const init = (bool, mockRenderDateTimeFn) => {
        mockUseDateTimeContextHook(bool, mockRenderDateTimeFn);
        wrapper = shallow(
            <DateTimeRenderer value="2020-08-07T20:41:03Z">
                {value => <p className="test-className">Hello {value}</p>}
            </DateTimeRenderer>
        );
    };

    beforeEach(() => {
        init();
    });

    afterEach(() => {
        spy.mockReset();
    });

    it('should render', () => {
        expect(wrapper).toBeTruthy();
    });

    it('renders the children html correctly along with the given value', () => {
        init(true, text => `render function: ${text}`);
        expect(wrapper.html()).toContain('test-className');
        expect(wrapper.text()).toContain('Hello render function: 2020-08-07T20:41:03Z');
    });

    describe('the tooltip', () => {
        it('renders the tooltip text correctly', () => {
            init(false);
            expect(wrapper.find('.nexus-c-dateTimeRender__tooltip').length).toEqual(1);
        });

        it('renders the tooltip text correctly', () => {
            init(true);
            expect(wrapper.find('.nexus-c-dateTimeRender__tooltip').length).toEqual(1);
        });
    });
});
