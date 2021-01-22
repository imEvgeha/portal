import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import classnames from 'classnames';
import {VZ, MOVIDA} from '../../../constants';
import {isNexusTitle} from '../../../utils';
import './ShrinkedHeader.scss';

const ShrinkedHeader = ({isShrinked, title, externalIds, onSyncPublish, titleId}) => {
    const [vzExternalData] = externalIds.filter(id => id.externalSystem === VZ.toLowerCase());
    const vzButtonType = vzExternalData ? 'sync' : 'publish';
    const [movidaExternalData] = externalIds.filter(id => id.externalSystem === MOVIDA.toLowerCase());
    const movidaButtonType = movidaExternalData ? 'sync' : 'publish';

    const getButtonLabel = externalSystem => {
        const externalData = externalSystem === VZ ? vzExternalData : movidaExternalData;
        return externalData && externalData.publishedAt ? `Sync to ${externalSystem}` : `Publish to ${externalSystem}`;
    };

    return (
        <div
            className={classnames('nexus-c-shrinked-header', {
                'nexus-c-shrinked-header--visible': isShrinked,
            })}
        >
            <div>{title}</div>
            {isNexusTitle(titleId) && (
                <div className="nexus-c-shrinked-header__sync-publish">
                    <Button appearance="default" onClick={() => onSyncPublish(VZ, vzButtonType)}>
                        {getButtonLabel(VZ)}
                    </Button>
                    <Button appearance="default" onClick={() => onSyncPublish(MOVIDA, movidaButtonType)}>
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
};

ShrinkedHeader.defaultProps = {
    isShrinked: false,
    title: null,
    onSyncPublish: () => null,
    externalIds: [],
    titleId: null,
};

export default ShrinkedHeader;
