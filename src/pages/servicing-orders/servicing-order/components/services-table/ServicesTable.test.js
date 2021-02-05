import React from 'react';
import {shallow} from 'enzyme';
import ServicesTable from './ServicesTable';

describe('ServicesTable', () => {
    let wrapper = null;

    beforeEach(() => {
        const data = {
            amsAssetId: 'DA16129',
            assetFormat: 'VIDEO_CONFORMANCEGROUP',
            assetType: 'DETE_FILE',
            barcode: 'DA16129',
            title: 'test title',
            deteServices: [
                {
                    type: 'Subtitles',
                    version: 'French',
                    standard: 'Forced',
                    operationalStatus: 'In Progress',
                    componentId: 'LOL-123',
                    spec: 'M-DBS-2398 SCC',
                    addRecipient: 'MGM',
                    sourceStandard: '_1080_23_976',
                },
            ],
            externalId: 'DA16129',
            externalSystem: 'VSOM',
            fs: 'DETE',
            startDate: '2020-05-19T15:13:13.731-03:00',
        };
        wrapper = shallow(<ServicesTable data={data} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders table wrapper', () => {
        expect(wrapper.find('.nexus-c-services-table')).toHaveLength(1);
    });

    it('renders table title', () => {
        expect(wrapper.find('.nexus-c-services-table__title').text()).toEqual('Services (0)');
    });

    it('renders table subtitle', () => {
        expect(wrapper.find('.nexus-c-services-table__subtitle').text()).toEqual('Barcode: ');
    });
});

