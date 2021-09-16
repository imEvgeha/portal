import React, {useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import NexusDropdown, {
    DropdownOptions,
    DropdownOption,
    DropdownToggle,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dropdown/NexusDropdown';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import styled from 'styled-components';
import {unmergeTitle} from '../../../titleMetadataServices';

const ActionMenuContainer = styled.div`
    padding-left: 48px;
    display: flex;
    justify-content: flex-end;
    border-left: 1px solid ${({theme}) => theme.colors.grays.dark};
`;

const UNMERGE_TITLE = 'Unmerge';
const UNMERGE_MESSAGE = 'Would you like to unmerge this title?';

const ActionMenu = ({titleId}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const openUnmergeDialog = useCallback(() => {
        const confirmUnmerge = () => {
            unmergeTitle(titleId);
            closeModal();
        };

        const actions = [
            {
                text: 'Cancel',
                onClick: () => closeModal(),
                appearance: 'secondary',
            },
            {
                text: 'Unmerge',
                onClick: confirmUnmerge,
                appearance: 'primary',
            },
        ];
        openModal(UNMERGE_MESSAGE, {title: UNMERGE_TITLE, width: 'medium', actions});
    }, [titleId]);

    return (
        <ActionMenuContainer>
            <NexusDropdown>
                <DropdownToggle label="Actions" isMobile />
                <DropdownOptions isMobile align="top">
                    <DropdownOption value="unmerge" onSelect={() => openUnmergeDialog(titleId)}>
                        Unmerge
                    </DropdownOption>
                </DropdownOptions>
            </NexusDropdown>
        </ActionMenuContainer>
    );
};

ActionMenu.propTypes = {
    titleId: PropTypes.string.isRequired,
};

ActionMenu.defaultProps = {};

export default ActionMenu;
