import React, {useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import {isAllowed, Restricted} from '@portal/portal-auth/permissions';
import NexusDropdown, {
    DropdownOption,
    DropdownOptions,
    DropdownToggle,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dropdown/NexusDropdown';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {toString, toLower} from 'lodash';
import './ActionMenu.scss';
import {unmergeTitle} from '../../../titleMetadataServices';
import TitleCreateCopyModal from '../../titleCreateCopyModal/TitleCreateCopyModal';

const UNMERGE_TITLE = 'Unmerge';
const UNMERGE_MESSAGE = 'Would you like to unmerge this title?';

const ActionMenu = ({title, containerClassName, externalIdOptions, editorialMetadata}) => {
    const contentTypesCrateCopyArray = ['movie', 'documentary'];
    const dropdownOption = {copyDesc: 'Copy...', unmergeDesc: 'Unmerge'};

    const {openModal, closeModal} = useContext(NexusModalContext);
    const isAbleCreateCopy = contentTypesCrateCopyArray.includes(toLower(toString(title.contentType)));
    const isDropDownActionVisible = isAllowed('unmergeTitleAction') || isAbleCreateCopy;
    const [displayModal, setDisplayModal] = React.useState(false);

    const openUnmergeDialog = useCallback(() => {
        const confirmUnmerge = () => {
            unmergeTitle(title.id);
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
    }, [title.id]);

    const handleCloseModal = () => {
        setDisplayModal(false);
    };

    return isDropDownActionVisible ? (
        <div className={containerClassName}>
            <NexusDropdown>
                <DropdownToggle label="Actions" isMobile />

                <DropdownOptions isMobile align="top">
                    {isAbleCreateCopy && (
                        <Restricted resource="createTitleCopyButton">
                            <DropdownOption value="copy" onSelect={() => setDisplayModal(true)}>
                                <i className="pi pi-copy" /> {dropdownOption.copyDesc}
                            </DropdownOption>
                        </Restricted>
                    )}
                    <Restricted resource="unmergeTitleAction">
                        <DropdownOption value="unmerge" onSelect={() => openUnmergeDialog(title.id)}>
                            {dropdownOption.unmergeDesc}
                        </DropdownOption>
                    </Restricted>
                </DropdownOptions>
            </NexusDropdown>

            <TitleCreateCopyModal
                display={displayModal}
                title={title}
                externalIdOptions={externalIdOptions}
                handleCloseModal={handleCloseModal}
                editorialMetadata={editorialMetadata}
            />
        </div>
    ) : null;
};

ActionMenu.propTypes = {
    title: PropTypes.object.isRequired,
    containerClassName: PropTypes.string,
    externalIdOptions: PropTypes.object,
    editorialMetadata: PropTypes.array,
};

ActionMenu.defaultProps = {
    containerClassName: '',
    externalIdOptions: {},
    editorialMetadata: [],
};

export default ActionMenu;
