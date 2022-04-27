import React, {useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import {keycloak} from '@vubiquity-nexus/portal-auth/keycloak';
import Restricted from '@vubiquity-nexus/portal-auth/lib/permissions/Restricted';
import NexusDropdown, {
    DropdownOption,
    DropdownOptions,
    DropdownToggle,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dropdown/NexusDropdown';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import './ActionMenu.scss';
import {unmergeTitle} from '../../../titleMetadataServices';

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
        <div className="nexus-c-actions-menu-container">
            <NexusDropdown>
                <DropdownToggle label="Actions" isMobile />
                <DropdownOptions isMobile align="top">
                    <Restricted
                        roles={{
                            operation: 'AND',
                            values: ['metadata_legacy_unmerge'],
                        }}
                    >
                        <DropdownOption value="unmerge" onSelect={() => openUnmergeDialog(titleId)}>
                            Unmerge
                        </DropdownOption>
                    </Restricted>
                </DropdownOptions>
            </NexusDropdown>
        </div>
    ) : null;
};

ActionMenu.propTypes = {
    titleId: PropTypes.string.isRequired,
};

ActionMenu.defaultProps = {};

export default ActionMenu;
