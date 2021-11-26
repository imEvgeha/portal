import React, {useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import NexusDropdown, {
    DropdownOptions,
    DropdownOption,
    DropdownToggle,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dropdown/NexusDropdown';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import styled from 'styled-components';
import {keycloak} from '../../../../../../packages/auth/keycloak';
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
    const {realmAccess} = keycloak;
    const {roles} = realmAccess || {};
    const isAbleSeeUnmergeBtn = roles.includes('metadata_admin');

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

    return isAbleSeeUnmergeBtn ? (
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
    ) : null;
};

ActionMenu.propTypes = {
    titleId: PropTypes.string.isRequired,
};

ActionMenu.defaultProps = {};

export default ActionMenu;
