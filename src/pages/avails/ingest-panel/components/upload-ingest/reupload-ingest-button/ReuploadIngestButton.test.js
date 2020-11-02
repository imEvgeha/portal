import React from 'react';
import {shallow} from 'enzyme';
import NexusTooltip from '../../../../../../ui/elements/nexus-tooltip/NexusTooltip';
import ReuploadIngestButton from './ReuploadIngestButton';

describe('ReuploadIngestButton', () => {
    let wrapper = null;
    const errorText = 'Some attachments could not be processed';
    let props = {};
    const attachment = {
        id: 'aath_iq5zK',
        type: 'availIngestHistoryAttachment',
        createdAt: '2020-03-26T08: 33: 42.900Z',
        updatedAt: '2020-03-26T10: 30: 34.868Z',
        createdBy: null,
        updatedBy: '62ee67dc-509f-4b07-8c36-b0753a28b203',
        attachmentType: 'Excel',
        link:
            'https: //vbq-cs-qa.s3.us-west-2.amazonaws.com/avails/archive/d8fa01e1-a9b6-454d-84f8-3d13ffce6e86/INT_avails_20k_(1).xlsx',
        downloadUrl: null,
        status: 'COMPLETED',
        errorReports: null,
        ingestReport: {
            total: 20001,
            success: 20001,
            created: 2,
            updated: 19999,
            fatal: 0,
            errors: 0,
            pending: 0,
            errorDetails: null,
        },
    };

    beforeEach(() => {
        props = {
            attachment,
        };
        wrapper = shallow(<ReuploadIngestButton {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should include an upload icon"', () => {
        const ingestReport = wrapper.find('.nexus-c-avails-ingest__upload-icon');
        expect(ingestReport).toHaveLength(1);
    });

    it('should include a tooltip', () => {
        const tooltips = wrapper.find(NexusTooltip);
        expect(tooltips).toHaveLength(1);
    });
});
