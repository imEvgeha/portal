import React, {useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import {Restricted, isAllowed} from '@portal/portal-auth/permissions';
import NexusDropdown, {
    DropdownOption,
    DropdownOptions,
    DropdownToggle,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dropdown/NexusDropdown';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {isNexusTitle} from '@vubiquity-nexus/portal-utils/lib/utils';
import {toString, toLower, startCase, toUpper} from 'lodash';
import {useDispatch} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import './ActionMenu.scss';
import TitleService from '../../../services/TitleService';
import {unmergeTitle} from '../../../titleMetadataServices';
import TitleCreateCopyModal from '../../titleCreateCopyModal/TitleCreateCopyModal';
import {CONTENT_TYPES} from '../../titleCreateModal/TitleCreateModalConstants';
import TitleDeleteModal from '../../titleDeleteModal/TitleDeleteModal';

const UNMERGE_TITLE = 'Unmerge';
const UNMERGE_MESSAGE = 'Would you like to unmerge this title?';

const ActionMenu = ({title, containerClassName, externalIdOptions, editorialMetadata}) => {
    const contentTypesCrateCopyArray = [CONTENT_TYPES.MOVIE.toLowerCase(), CONTENT_TYPES.DOCUMENTARY.toLowerCase()];

    const complexProperties = title?.tenantData?.complexProperties;
    const tenantDataLegacyIds = complexProperties?.find(item => item.name === 'legacyIds');

    const isAbleCreateCopy = contentTypesCrateCopyArray.includes(toLower(toString(title.contentType)));
    const dropdownOption = {copyDesc: 'Copy...', unmergeDesc: 'Unmerge', deleteDesc: 'Delete'};
    const contentTypeLowerCase = toLower(toString(title.contentType));
    const contentTypeUpperCase = toUpper(toString(title.contentType));
    const {openModal, closeModal} = useContext(NexusModalContext);
    const isContentTypeWithAssociatedContent =
        contentTypeUpperCase === 'SEASON' ||
        contentTypeUpperCase === 'SERIES' ||
        contentTypeUpperCase === 'MINI-SERIES';

    const displayUnmergeBtn = tenantDataLegacyIds && isAllowed('unmergeTitleAction') && isNexusTitle(title.id);
    const displayCopyBtn = isAbleCreateCopy && isAllowed('createTitleCopyAction');
    const displayDeleteBtn = isAllowed('deleteTitleAction');
    const displayThreeDots = displayUnmergeBtn || displayCopyBtn || displayDeleteBtn;

    const [displayCreateCopyModal, setDisplayCreateCopyModal] = React.useState(false);
    const [displayDeleteTitleModal, setDisplayDeleteTitleModal] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const routeParams = useParams();
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

    const deleteTitleModalMessage = () => {
        const question = `Would you like to delete this ${startCase(contentTypeLowerCase)}?`;
        if (isContentTypeWithAssociatedContent) {
            return {
                question,
                description: `This ${startCase(
                    contentTypeLowerCase
                )} may have ${isSeasonOrMiniContentType()} associated to it that will also be deleted.`,
            };
        }
        return {
            question,
            description: `You will not be able to recover the ${startCase(contentTypeLowerCase)} once deleted.`,
        };
    };

    const showSuccessTitleDeleteToast = () => {
        let detailDescription = `The ${startCase(contentTypeLowerCase)} ${toString(title.id)} was deleted.`;
        if (isContentTypeWithAssociatedContent) {
            detailDescription = `This ${startCase(contentTypeLowerCase)} ${toString(
                title.id
            )} and associated ${isSeasonOrMiniContentType()} were deleted.`;
        }
        dispatch(
            addToast({
                severity: 'success',
                detail: detailDescription,
            })
        );
    };

    /**
     * Thanks to this function, we understand what level of children this title has.
     * Season and Mini-Series types has episodes and series type has seasons and/or episodes
     * @returns Episodes if content type is SEASON or
     */
    const isSeasonOrMiniContentType = () => {
        return contentTypeUpperCase === 'SEASON' || contentTypeUpperCase === 'MINI-SERIES'
            ? 'Episodes'
            : 'Seasons and/or Episodes';
    };

    const onDeleteTitle = () => {
        TitleService.getInstance()
            .deleteTitle({
                titleId: title.id,
                forceDeleteChildren: isContentTypeWithAssociatedContent,
            })
            .then(() => {
                const url = `/${routeParams.realm}/metadata`;
                navigate(url);
                showSuccessTitleDeleteToast();
            });
    };

    return (
        <div className={containerClassName}>
            <NexusDropdown>
                {displayThreeDots ? <DropdownToggle label="Actions" isMobile /> : null}
                <DropdownOptions isMobile align="top">
                    <Restricted resource="deleteTitleAction">
                        <DropdownOption value="delete" onSelect={() => setDisplayDeleteTitleModal(true)}>
                            <i className="pi pi-trash pe-3" /> {dropdownOption.deleteDesc}
                        </DropdownOption>
                        <hr />
                    </Restricted>
                    {displayCopyBtn ? (
                        <Restricted resource="createTitleCopyAction">
                            <DropdownOption value="copy" onSelect={() => setDisplayCreateCopyModal(true)}>
                                <i className="pi pi-copy" /> {dropdownOption.copyDesc}
                            </DropdownOption>
                        </Restricted>
                    ) : null}
                    {displayUnmergeBtn ? (
                        <Restricted resource="unmergeTitleAction">
                            <DropdownOption value="unmerge" onSelect={() => openUnmergeDialog(title.id)}>
                                {dropdownOption.unmergeDesc}
                            </DropdownOption>
                        </Restricted>
                    ) : null}
                </DropdownOptions>
            </NexusDropdown>

            <TitleCreateCopyModal
                display={displayCreateCopyModal}
                title={title}
                externalIdOptions={externalIdOptions}
                handleCloseModal={() => setDisplayCreateCopyModal(false)}
                editorialMetadata={editorialMetadata}
            />
            <TitleDeleteModal
                header="Delete Title"
                onDelete={() => onDeleteTitle()}
                display={displayDeleteTitleModal}
                onCloseModal={() => setDisplayDeleteTitleModal(false)}
            >
                <div className="d-flex flex-column">
                    <span className="mb-3">{deleteTitleModalMessage().question}</span>
                    <span className="mb-4">{deleteTitleModalMessage().description}</span>
                </div>
            </TitleDeleteModal>
        </div>
    );
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
