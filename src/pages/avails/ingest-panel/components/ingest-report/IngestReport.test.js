/* eslint-disable no-magic-numbers */
import React from 'react';
import {shallow} from 'enzyme';
import NexusTooltip from '../../../../../ui/elements/nexus-tooltip/NexusTooltip';
import IngestReport from './IngestReport';

describe('IngestReport', () => {
    let wrapper = null;
    const errorText = 'Some attachments could not be processed';
    let props = {};

    beforeEach(() => {
        props = {
            filterClick: () => null,
            report: {
                total: 20001,
                success: 1000,
                created: 1001,
                updated: 19999,
                fatal: 3,
                errors: 2,
                pending: 0,
                errorDetails: errorText,
            },
            ingestId: 'avih_zLTMLyei6L',
        };
        wrapper = shallow(<IngestReport {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should include an ingest-report and ingest-report__fields  div', () => {
        const ingestReport = wrapper.find('.ingest-report');
        expect(ingestReport).toHaveLength(1);
        const ingestReportFields = wrapper.find('.ingest-report__fields');
        expect(ingestReportFields).toHaveLength(1);
    });

    it('should include error message', () => {
        const errorMessage = wrapper.find('.ingest-report__error-message');
        expect(errorMessage).toHaveLength(1);
        expect(errorMessage.text()).toEqual(errorText);
    });

    it('should include error message', () => {
        const labels = wrapper.find('.ingest-report__field--label');
        expect(labels).toHaveLength(6);
        const values = wrapper.find('.ingest-report__field--value');
        expect(values).toHaveLength(6);
        expect(labels.at(0).text()).toEqual('Rights');
        expect(values.at(0).text()).toEqual('20001');

        expect(labels.at(1).text()).toEqual('New');
        expect(values.at(1).text()).toEqual('1001');

        expect(labels.at(2).text()).toEqual('Updated');
        expect(values.at(2).text()).toEqual('19999');

        expect(labels.at(3).text()).toEqual('Fatals');
        expect(values.at(3).text()).toEqual('3');

        expect(labels.at(4).text()).toEqual('Pending');
        expect(values.at(4).text()).toEqual('0');

        expect(labels.at(5).text()).toEqual('Errors');
        expect(values.at(5).text()).toEqual('2');
    });

    it('should not include any tooltip', () => {
        const tooltips = wrapper.find(NexusTooltip);
        expect(tooltips).toHaveLength(0);
    });

    it('should include tooltip', () => {
        const updatedProps = {...props, hasTooltips: true};
        wrapper = shallow(<IngestReport {...updatedProps} />);
        const tooltips = wrapper.find(NexusTooltip);
        expect(tooltips).toHaveLength(2);
    });

});

