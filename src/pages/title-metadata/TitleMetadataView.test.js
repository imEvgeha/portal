import React from 'react';
import {shallow} from 'enzyme';
import TitleMetadataView from './TitleMetadataView';

describe('TitleMetadataView', () => {
    let wrapper = null;
    let titleMetadataHeader = null;
    let titleMetadataTable = null;
    let createBtn = null;
    let syncBtn = null;

    beforeAll(() => {
        wrapper = shallow(<TitleMetadataView />);
        titleMetadataHeader = wrapper.find('TitleMetadataHeader');
        titleMetadataTable = wrapper.find('TitleMetadataTable');
        createBtn = wrapper.find('.nexus-c-title-metadata__create-btn');
        syncBtn = wrapper.find('.nexus-c-title-metadata__sync-btn');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render title metadata wrapper', () => {
        expect(wrapper.find('.nexus-c-title-metadata')).toHaveLength(1);
    });

    it('should render TitleMetadataHeader', () => {
        expect(titleMetadataHeader.length).toEqual(1);
    });

    it('should render TitleMetadataTable', () => {
        expect(titleMetadataTable.length).toEqual(1);
    });

    it('should render Create button', () => {
        expect(createBtn.length).toEqual(1);
    });

    it('should render Sync button', () => {
        expect(syncBtn.length).toEqual(1);
    });
});
