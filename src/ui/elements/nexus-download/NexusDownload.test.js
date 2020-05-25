import React from 'react';
import {shallow} from 'enzyme';
import NexusDownload from './NexusDownload';

describe('NexusDownload', () => {
    let wrapper;
    beforeEach(() => {
        const props = {
            data: { test: 'awesome string'},
            filename: 'event_filename',
        };
        wrapper = shallow(<NexusDownload {...props} />);
    });

    it('should render the component', () => {
        expect(wrapper).not.toBe(null);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
