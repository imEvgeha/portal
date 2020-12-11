import React from 'react';
import {shallow} from 'enzyme';
import FileSaver from 'file-saver';
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

    it('should call file-saver with proper arguments', () => {
        const button = wrapper.find('.nexus-c-download');
        expect(button.length).toEqual(1);

        const spy = jest.spyOn(FileSaver, 'saveAs');

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
