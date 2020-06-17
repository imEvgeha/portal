import React from 'react';
import {shallow} from 'enzyme';
import BulkMatchView from './BulkMatchView';
import NexusTooltip from '../../../ui/elements/nexus-tooltip/NexusTooltip';
import {WARNING_MSG} from './bulkMatchConstants';

describe('EventManagementTable', () => {
    let wrapper;
    const selectedRights = [
        {
            id: 'rght_4BL6B',
            contentType: 'Movie',
            coreTitleId: null,
            sourceRightId: 'rght_Ej8yg'
        },
        {
            id: 'rght_4BL6C',
            contentType: 'Movie',
            coreTitleId: null,
            sourceRightId: 'rght_Ej7yr'
        },
    ];

    beforeEach(() => {
        wrapper = shallow(<BulkMatchView selectedRights={selectedRights} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });


    it('should be active and not show warning message when coreTitleId and sourceRightId is null for all rights and contentType is the same for all rights', () => {
        selectedRights[0].sourceRightId = null;
        selectedRights[1].sourceRightId = null;
        wrapper = shallow(<BulkMatchView selectedRights={selectedRights} />);
        const tooltip = wrapper.find(NexusTooltip);
        expect(tooltip.props().content).toEqual('');
        expect(wrapper.find('.nx-container-margin.table-top-text.nexus-c-bulk-match-view.active-link').length).toEqual(1);
    });

    it('should be active and not show warning message when coreTitleId is null for all rights, contentType is the same for all rights and sourceRightId is unique for each right', () => {
        const tooltip = wrapper.find(NexusTooltip);
        expect(tooltip.props().content).toEqual('');
        expect(wrapper.find('.nx-container-margin.table-top-text.nexus-c-bulk-match-view.active-link').length).toEqual(1);
    });

    it('should be disabled and show warning message when sourceRightId is not unique for each selected right', () => {
        selectedRights[0].sourceRightId = 'rght_Ej7yr';
        wrapper = shallow(<BulkMatchView selectedRights={selectedRights} />);
        const tooltip = wrapper.find(NexusTooltip);
        expect(tooltip.props().content).toEqual(WARNING_MSG);
        expect(wrapper.find('.nx-container-margin.table-top-text.nexus-c-bulk-match-view').length).toEqual(1);
    });

    it('should be disabled and show warning message when contentType not the same for all selected right', () => {
        selectedRights[0].contentType = 'Episode';
        wrapper = shallow(<BulkMatchView selectedRights={selectedRights} />);
        const tooltip = wrapper.find(NexusTooltip);
        expect(tooltip.props().content).toEqual(WARNING_MSG);
        expect(wrapper.find('.nx-container-margin.table-top-text.nexus-c-bulk-match-view').length).toEqual(1);
    });

    it('should be disabled and show warning message when coreTitleId is not null for all selected right', () => {
        selectedRights[0].coreTitleId = 'Title1';
        wrapper = shallow(<BulkMatchView selectedRights={selectedRights} />);
        const tooltip = wrapper.find(NexusTooltip);
        expect(tooltip.props().content).toEqual(WARNING_MSG);
        expect(wrapper.find('.nx-container-margin.table-top-text.nexus-c-bulk-match-view').length).toEqual(1);
    });

});
