import React from 'react';
import {shallow} from 'enzyme';
import TitleMetadataTableStatusBar from './TitleMetadataTableStatusBar';

describe('TitleMetadataTableStatusBar', () => {
    let wrapper = null;

    const props = {
        paginationData: {
            pageSize: 0,
            totalCount: 0,
        },
    };

    beforeEach(() => {
        wrapper = shallow(<TitleMetadataTableStatusBar {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render status bar message', () => {
        const statusDescription = wrapper.find('.nexus-c-title-metadata-table-status-bar__description');
        expect(statusDescription.text()).toEqual('Rows: 0 of 0');
    });
});
