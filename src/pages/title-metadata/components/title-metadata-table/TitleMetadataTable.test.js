import React from 'react';
import {shallow} from 'enzyme';
import TitleMetadataTable from './TitleMetadataTable';

describe('TitleMetadataTable', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<TitleMetadataTable />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders TitleMetadataTableGrid wrapper', () => {
        expect(wrapper.find('.nexus-c-title-metadata-table')).toHaveLength(1);
    });
});
