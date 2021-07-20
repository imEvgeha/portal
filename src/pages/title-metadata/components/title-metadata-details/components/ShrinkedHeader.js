import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import classnames from 'classnames';
import {VZ, MOVIDA, MGM, UNABLE_PUBLISH} from '../../../constants';
import {isNexusTitle} from '../../../utils';
import './ShrinkedHeader.scss';

const ShrinkedHeader = ({
    isShrinked,
    title,
    externalIds,
    onSyncPublish,
    titleId,
    isEditView,
    catalogueOwner,
    isVZSyncing,
    isVZPublishing,
    isMOVSyncing,
    isMOVPublishing,
    isVZdisabled,
}) => {
    const [vzExternalData] = externalIds.filter(id => id.externalSystem === VZ.toLowerCase());
    const vzButtonType = vzExternalData ? 'sync' : 'publish';
    const [movidaExternalData] = externalIds.filter(id => id.externalSystem === MOVIDA.toLowerCase());
    const movidaButtonType = movidaExternalData ? 'sync' : 'publish';

    const getButtonLabel = externalSystem => {
        const externalData = externalSystem === VZ ? vzExternalData : movidaExternalData;
        return externalData && externalData.publishedAt ? `Sync to ${externalSystem}` : `Publish to ${externalSystem}`;
    };
    const buildButton = () => {
        return (
            <Button
                // isDisabled={isVZdisabled}
                appearance="default"
                isLoading={isVZSyncing || isVZPublishing}
                onClick={() => onSyncPublish(VZ, vzButtonType)}
            >
                {getButtonLabel(VZ)}
            </Button>
        );
    };

    return (
        <div
            className={classnames('nexus-c-shrinked-header', {
                'nexus-c-shrinked-header--visible': isShrinked,
            })}
        >
            <div>{title}</div>
            {catalogueOwner !== MGM && isNexusTitle(titleId) && !isEditView && (
                <div className="nexus-c-shrinked-header__sync-publish">
                    {isVZdisabled ? <Tooltip content={UNABLE_PUBLISH}>{buildButton()}</Tooltip> : buildButton()}
                    <Button
                        appearance="default"
                        isLoading={isMOVSyncing || isMOVPublishing}
                        onClick={() => onSyncPublish(MOVIDA, movidaButtonType)}
                    >
                        {getButtonLabel(MOVIDA)}
                    </Button>
                </div>
            )}
        </div>
    );
};

ShrinkedHeader.propTypes = {
    isShrinked: PropTypes.bool,
    title: PropTypes.string,
    onSyncPublish: PropTypes.func,
    externalIds: PropTypes.array,
    titleId: PropTypes.string,
    isEditView: PropTypes.bool,
    catalogueOwner: PropTypes.string,
    isVZSyncing: PropTypes.bool,
    isVZPublishing: PropTypes.bool,
    isMOVSyncing: PropTypes.bool,
    isMOVPublishing: PropTypes.bool,
    isVZdisabled: PropTypes.bool,
};

ShrinkedHeader.defaultProps = {
    isShrinked: false,
    title: null,
    onSyncPublish: () => null,
    externalIds: [],
    titleId: null,
    isEditView: false,
    catalogueOwner: null,
    isVZSyncing: false,
    isVZPublishing: false,
    isMOVSyncing: false,
    isMOVPublishing: false,
    isVZdisabled: false,
};

export default ShrinkedHeader;
