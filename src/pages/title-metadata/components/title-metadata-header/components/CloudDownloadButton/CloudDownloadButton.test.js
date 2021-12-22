import React from 'react';
import {shallow} from 'enzyme';
import CloudDownloadButton from './CloudDownloadButton';

describe('CloudDownloadButton', () => {
    let wrapper = null;
    
    beforeAll(() => {
        wrapper = shallow(<CloudDownloadButton />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render download icon container', () => {
        expect(wrapper.find('.nexus-c-button-cloud-download')).toHaveLength(1);
    });

    it('should render dialog for emet donloading (modal window)', () => {
        expect(wrapper.find('.nexus-c-button-dialog-for-emet-download')).toHaveLength(1);
    });
});
