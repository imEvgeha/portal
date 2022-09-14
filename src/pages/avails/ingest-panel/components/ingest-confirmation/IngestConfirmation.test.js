import React from 'react';
import {Button} from '@portal/portal-components';
import {shallow} from 'enzyme';
import IngestConfirmation from './IngestConfirmation';
import {INGEST_ASSIGN_MESSAGE, INGEST_UPLOAD_CONTINUE_MSG} from './constants';

describe('IngestConfirmation', () => {
    let wrapper = null;
    const cancelUploadMock = jest.fn();
    const confirmUploadMock = jest.fn();

    const props = {
        licensor: '1091',
        serviceRegion: 'UK',
        licensee: 'CVA, Cell C',
        catalog: 'Full Catalog',
        isLicenced: true,
        onActionCancel: cancelUploadMock,
        onActionConfirm: confirmUploadMock,
    };

    beforeEach(() => {
        wrapper = shallow(<IngestConfirmation {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should display confirmation message', () => {
        const message = wrapper.find('.nexus-c-ingest-confirmation__message');
        expect(message.text().includes(INGEST_ASSIGN_MESSAGE)).toBe(true);
    });

    it('should display available actions message', () => {
        const message = wrapper.find('.nexus-c-ingest-confirmation__actions');
        expect(message.text().includes(INGEST_UPLOAD_CONTINUE_MSG)).toBe(true);
    });

    it('closes confirmation modal when cancel button is clicked', () => {
        wrapper.find('.nexus-c-ingest-confirmation__cancel-btn').simulate('click');
        expect(cancelUploadMock).toHaveBeenCalled();
    });

    it('confirms ingest upload when continue button is clicked', () => {
        wrapper.find('.nexus-c-ingest-confirmation__continue-btn').simulate('click');
        expect(confirmUploadMock).toHaveBeenCalled();
    });

    it('renders Cancel and Continue buttons', () => {
        expect(wrapper.find(Button)).toHaveLength(2);
    });
});
