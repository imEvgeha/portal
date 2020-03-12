import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NexusTooltip from '../nexus-tooltip/NexusTooltip';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import './NexusTag.scss';


let NexusTag = ({value, text, tagState, onClick, onRemove}) => {

    const [defaultTooltipContent, setDefaultContent] = useState();

    useEffect(()=> {
        if(value) {
            const defaultTooltipContent = Object.keys(value || {}).map((key, index) => {
                return (
                    key !== 'state'
                    && !Array.isArray(value[key])
                    && typeof value[key] !== 'object'
                    && value[key] !== null
                    && (
                        <li className="nexus-c-tag__tooltip-prop" key={index}>
                            {key}:
                            <span className="nexus-c-tag__tooltip-prop-value">
                                { getValidValue(value[key]) }
                            </span>
                        </li>
                    )
                );
            });
            setDefaultContent(defaultTooltipContent);
        }
    }, [value]);

    const getValidValue = (value) => {
        if(typeof value !== 'undefined') {
            return value.toString();
        }
        return '-';
    };

    const tooltip = (
        <div className="nexus-c-tag__tooltip">
            <ul className="nexus-c-tag__tooltip-list">
                {defaultTooltipContent}
            </ul>
        </div>
    );

    return (
        <NexusTooltip content={tooltip}>
            <span className={`nexus-c-tag ${(tagState && `nexus-c-tag--is-${tagState}`) || ''}`}>
                <div
                    className={`nexus-c-tag__label ${onClick && 'nexus-c-tag__label--is-clickable'}`}
                    onClick={onClick}
                >
                    {text}
                </div>
                {onRemove && (
                    <div className="nexus-c-tag__remove-button" onClick={onRemove}>
                        <EditorCloseIcon size="medium" />
                    </div>
                  )}
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
    onClick: () => {
  return null;
},
    onRemove: () => {
  return null;
},
};

export default NexusTag;