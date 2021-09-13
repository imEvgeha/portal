import React, {useState, useEffect, useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import NexusDropdown, {
    DropdownOptions,
    DropdownOption,
    DropdownToggle,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dropdown/NexusDropdown';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import classnames from 'classnames';
import {MGM} from '../../../constants';
import {unmergeTitle} from '../../../titleMetadataServices';
import {isNexusTitle} from '../../../utils';
import TitleInfo from './TitleInfo';
import './TitleDetailsHeader.scss';

const ARROW_COLOR = '#42526e';
const UNMERGE_TITLE = 'Unmerge';
const UNMERGE_MESSAGE = 'Would you like to unmerge this title?';

const TitleDetailsHeader = ({history, title, containerRef, canEdit}) => {
    const [isShrinked, setIsShrinked] = useState(false);
    const {openModal, closeModal} = useContext(NexusModalContext);

    useEffect(() => {
        window.addEventListener('scroll', onScroll, true);
        return () => window.removeEventListener('scroll', onScroll, true);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            if (isShrinked) {
                containerRef.current.classList.add('nexus-c-dynamic-form__tab-container--shrinked-title');
            } else {
                containerRef.current.classList.remove('nexus-c-dynamic-form__tab-container--shrinked-title');
            }
        }
    }, [isShrinked]);

    const onBackArrowClicked = () => {
        history.goBack();
    };

    const onScroll = event => {
        let toShrink = false;
        const SHRINK_BOUNDARY = 25;
        if (event.target.scrollTop > SHRINK_BOUNDARY) toShrink = true;
        setIsShrinked(toShrink);
    };

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

    return (
        <div className="nexus-c-title-details-header">
            <span onClick={onBackArrowClicked}>
                <ArrowLeftIcon size="large" primaryColor={ARROW_COLOR} />
            </span>
            <div
                className={classnames('nexus-c-title-details-header__content', {
                    'nexus-c-title-details-header__content--hidden': isShrinked,
                })}
            >
                <div
                    className={classnames('nexus-c-title-details-header__title-info-container', {
                        'nexus-c-title-details-header__title-info-container--no-border':
                            title.catalogOwner === MGM || !isNexusTitle(title.id) || canEdit,
                    })}
                >
                    <TitleInfo
                        title={title.title}
                        releaseYear={title.releaseYear}
                        contentType={title.contentType}
                        titleImages={title.images}
                        catalogueOwner={title.catalogOwner}
                    />
                </div>
                {title.id && (
                    <div className="nexus-c-title-details-header__action-dropdown">
                        <NexusDropdown>
                            <DropdownToggle label="Actions" isMobile />
                            <DropdownOptions isMobile>
                                <DropdownOption value="unmerge" onSelect={() => openUnmergeDialog(title.id)}>
                                    Unmerge
                                </DropdownOption>
                            </DropdownOptions>
                        </NexusDropdown>
                    </div>
                )}
            </div>
            <div
                className={classnames('nexus-c-shrinked-header', {
                    'nexus-c-shrinked-header--visible': isShrinked,
                })}
            >
                <div>{title.title}</div>
            </div>
        </div>
    );
};

TitleDetailsHeader.propTypes = {
    history: PropTypes.object,
    title: PropTypes.object,
    containerRef: PropTypes.any,
    canEdit: PropTypes.bool,
};

TitleDetailsHeader.defaultProps = {
    history: {},
    title: {},
    containerRef: null,
    canEdit: false,
};

export default TitleDetailsHeader;
