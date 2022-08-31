import React, {useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import {isAllowed, Restricted} from '@portal/portal-auth/permissions';
import NexusDropdown, {
    DropdownOption,
    DropdownOptions,
    DropdownToggle,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dropdown/NexusDropdown';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {toLower, toString} from 'lodash';
import './ActionMenu.scss';
import {unmergeTitle} from '../../../titleMetadataServices';
import TitleCreateCopyModal from '../../titleCreateCopyModal/TitleCreateCopyModal';
import {CONTENT_TYPES} from '../../titleCreateModal/TitleCreateModalConstants';

const UNMERGE_TITLE = 'Unmerge';
const UNMERGE_MESSAGE = 'Would you like to unmerge this title?';

const ActionMenu = ({title, containerClassName, externalIdOptions, editorialMetadata}) => {
    const contentTypesCrateCopyArray = [CONTENT_TYPES.MOVIE.toLowerCase(), CONTENT_TYPES.DOCUMENTARY.toLowerCase()];
    const dropdownOption = {copyDesc: 'Copy...', unmergeDesc: 'Unmerge'};

    const complexProperties = title?.tenantData?.complexProperties;
    const tenantDataLegacyIds = complexProperties?.find(item => item.name === 'legacyIds');

    const {openModal, closeModal} = useContext(NexusModalContext);
    const isAbleCreateCopy = contentTypesCrateCopyArray.includes(toLower(toString(title.contentType)));
    const isDropDownActionVisible =
        (tenantDataLegacyIds && isAllowed('unmergeTitleAction')) ||
        isAllowed('deleteTitleAction') ||
        (isAbleCreateCopy && isAllowed('createTitleCopyButton'));
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
                    {isAbleCreateCopy && isAllowed('createTitleCopyButton') && (
                        <Restricted resource="createTitleCopyButton">
                            <DropdownOption value="copy" onSelect={() => setDisplayModal(true)}>
                                <i className="pi pi-copy" /> {dropdownOption.copyDesc}
                            </DropdownOption>
                        </Restricted>
                    )}
                    {tenantDataLegacyIds && isAllowed('unmergeTitleAction') && (
                        <Restricted resource="unmergeTitleAction">
                            <DropdownOption value="unmerge" onSelect={() => openUnmergeDialog(title.id)}>
                                {dropdownOption.unmergeDesc}
                            </DropdownOption>
                        </Restricted>
                    )}
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
