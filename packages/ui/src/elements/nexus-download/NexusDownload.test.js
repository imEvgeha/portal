import React from 'react';
import * as commonJs from '@vubiquity-nexus/portal-utils/lib/Common';
import {shallow} from 'enzyme';
import NexusDownload from './NexusDownload';

describe('NexusDownload', () => {
    let wrapper = null;
    const props = {
        data: {test: 'awesome string'},
        filename: 'event_filename',
        mimeType: 'application/json',
    };

    global.Blob = (content, options) => ({content, options});
    global.URL.createObjectURL = jest.fn();

    beforeEach(() => {
        wrapper = shallow(<NexusDownload {...props} />);
    });

    it('should render the component', () => {
        expect(wrapper).not.toBe(null);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should call downloadFile with proper arguments', () => {
        const button = wrapper.find('.nexus-c-download');
        expect(button.length).toEqual(1);

        const spy = jest.spyOn(commonJs, 'downloadFile');

        button.simulate('click');

        expect(spy).toHaveBeenCalledWith(
            {
                content: [JSON.stringify(props.data, null, 2)],
                options: {
                    type: props.mimeType,
                },
            },
            props.filename
        );

        spy.mockRestore();
    });
});
