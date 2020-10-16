/* eslint-disable no-magic-numbers */
import React from 'react';
import {shallow} from 'enzyme';
import Ingest from './Ingest';

describe('Ingest', () => {
    let wrapper = null;
    let deselectIngest = null;
    let downloadIngestEmail = null;
    let downloadIngestFile = null;
    let attachments = null;

    beforeEach(() => {
        deselectIngest = jest.fn();
        downloadIngestEmail = jest.fn();
        downloadIngestFile = jest.fn();

        attachments = [
            {
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
            },
            {
                id: 'aath_TB6qr',
                type: 'availIngestHistoryAttachment',
                createdAt: '2020-03-16T08:10:24.919Z',
                updatedAt: '2020-03-16T08:11:01.398Z',
                createdBy: null,
                updatedBy: '62ee67dc-509f-4b07-8c36-b0753a28b203',
                attachmentType: 'Excel',
                link:
                    'https://vbq-cs-qa.s3.us-west-2.amazonaws.com/avails/archive/73ea9f26-9700-62cb-3ca0-b697fe519775/lgusa_1_multifile_ingestion_3.xlsx',
                downloadUrl: null,
                status: 'FAILED',
                errorReports: null,
                ingestReport: {
                    total: 24,
                    success: 6,
                    created: 3,
                    updated: 3,
                    fatal: 18,
                    errors: 0,
                    pending: 0,
                    errorDetails: null,
                },
            },
            {
                id: 'aath_c7oxd',
                type: 'availIngestHistoryAttachment',
                createdAt: '2020-03-16T08:10:25.253Z',
                updatedAt: '2020-03-16T08:11:01.731Z',
                createdBy: null,
                updatedBy: '62ee67dc-509f-4b07-8c36-b0753a28b203',
                attachmentType: 'Email',
                link:
                    'https://vbq-cs-qa.s3.us-west-2.amazonaws.com/avails/archive/73ea9f26-9700-62cb-3ca0-b697fe519775/mail.eml',
                downloadUrl: null,
                status: 'COMPLETED',
                errorReports: null,
                ingestReport: null,
            },
            {
                id: 'aath_c8cxd',
                type: 'availIngestHistoryAttachment',
                createdAt: '2020-03-16T08:10:25.253Z',
                updatedAt: '2020-03-16T08:11:01.731Z',
                createdBy: null,
                updatedBy: '62ee67dc-509f-4b07-8c36-b0753a28b203',
                attachmentType: 'Email',
                link:
                    'https://vbq-cs-qa.s3.us-west-2.amazonaws.com/avails/archive/73ea9f26-9700-62cb-3ca0-b697fe519776/mail.eml',
                downloadUrl: null,
                status: 'COMPLETED',
                errorReports: null,
                ingestReport: null,
            },
        ];

        const props = {
            filterByStatus: () => null,
            deselectIngest,
            downloadIngestEmail,
            downloadIngestFile,
            attachment: attachments[0],
            ingest: {
                id: 'avih_Tergd',
                type: 'availIngestHistory',
                createdAt: '2020-03-26T08: 33: 39.760Z',
                updatedAt: '2020-03-26T10: 30: 34.540Z',
                createdBy: '62ee67dc-509f-4b07-8c36-b0753a28b203',
                updatedBy: null,
                licensor: null,
                externalId: 'd8fa01e1-a9b6-454d-84f8-3d13ffce6e86',
                status: 'COMPLETED',
                ingestType: 'Upload',
                received: '2020-03-26T08: 33: 38.357Z',
                templateName: null,
                sourceEmail: null,
                deliveryEmail: '(determined by drools engine based on source email)',
                dopProjectId: 'Project408',
                serviceRegion: 'UK',
                internal: true,
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
                attachments,
            },
        };
        wrapper = shallow(<Ingest {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have a cross-circle icon and call deselectIngest when  is clicked', () => {
        const crossCircle = wrapper.find('.nexus-c-avails-ingest__cross-circle');
        expect(crossCircle).toHaveLength(1);
        crossCircle.simulate('click');
        expect(deselectIngest).toHaveBeenCalled();
    });

    it('should have only one download file icon and call downloadIngestFile with the attachment as param when is clicked', () => {
        const downloadIcon = wrapper.find('.nexus-c-avails-ingest__download-icon');
        expect(downloadIcon).toHaveLength(1);
        downloadIcon.simulate('click');
        expect(downloadIngestFile).toHaveBeenCalledWith(attachments[0]);
    });

    it('should have 2 email icons and call downloadIngestEmail with the attachment as param when is clicked', () => {
        const emailIcons = wrapper.find('.nexus-c-avails-ingest__email-icon');
        expect(emailIcons).toHaveLength(2);
        emailIcons.at(0).simulate('click');
        expect(downloadIngestEmail).toHaveBeenCalledWith(attachments[2]);
    });
});
