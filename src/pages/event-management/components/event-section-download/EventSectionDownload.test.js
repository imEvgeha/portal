import React from 'react';
import {shallow} from 'enzyme';
import EventSectionDownload from './EventSectionDownload';

describe('EventSectionDownload', () => {
    let wrapper;
    beforeEach(() => {
        const props = {
            data: { test: 'awesome string'},
            filename: 'event_filename',
        };
        wrapper = shallow(<EventSectionDownload {...props} />);
    });

    it('should render the component', () => {
        expect(wrapper).not.toBe(null);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
