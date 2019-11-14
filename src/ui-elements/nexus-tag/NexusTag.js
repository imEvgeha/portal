import React from 'react';
import PropTypes from 'prop-types';
import NexusTooltip from '../nexus-tooltip/NexusTooltip';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import './NexusTag.scss';


const NexusTag = ({value, text, tagState, onClick, onRemove}) => {
    const tooltip = (
        <div className="nexus-c-tag__tooltip">
            <ul className="nexus-c-tag__tooltip-list">
                {Object.keys(value || {}).map((key, index) => {
                    return (
                        !Array.isArray(value[key])
                            && typeof value[key] !== 'object'
                            && value[key] !== null
                            && (
                                <li className="nexus-c-tag__tooltip-prop" key={index}>
                                    {key}:
                                    <span className="nexus-c-tag__tooltip-prop-value">
                                        {value[key] || '-'}
                                    </span>
                                </li>
                            )
                    );
                })}
            </ul>
        </div>
    );

    return (
        <NexusTooltip content={tooltip}>
            <span className={`nexus-c-tag ${(tagState && `nexus-c-tag--is-${tagState}`) || ''}`}>
                <div
                    className={`nexus-c-tag__label ${onClick && 'nexus-c-tag__label--is-clickable'}`}
                    onClick={onClick || (() => null)}
                >
                    {text}
                </div>
                {onRemove &&
                    <div className="nexus-c-tag__remove-button" onClick={onRemove}>
                        <EditorCloseIcon size="medium" />
                    </div>
                }
            </span>
        </NexusTooltip>
    );
};

NexusTag.propTypes = {
    value: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    tagState: PropTypes.string,
    onClick: PropTypes.func,
    onRemove: PropTypes.func,
};

NexusTag.defaultProps = {
    tagState: '',
    onClick: null,
    onRemove: null,
};

export default NexusTag;