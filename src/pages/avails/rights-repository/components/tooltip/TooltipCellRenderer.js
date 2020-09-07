import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import classnames from 'classnames';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {calculateIndicatorType, INDICATOR_SUCCESS, INDICATOR_RED} from '../../util/indicator';
import {ERROR_NO_CORE_TITLE_ID, FIND_MATCH, MATCHED_TITLE, NO_MATCHING_TITLE} from './constants';
import './TooltipCellRenderer.scss';

const TooltipCellRenderer = ({data = {}, isTooltipEnabled, setSingleRightMatch}) => {
    const [isTitleMatchTooltipOpen, setIsTitleMatchTooltipOpen] = useState(false);
    const {id} = data || {};
    const indicator = calculateIndicatorType(data);
    const notificationClass = indicator !== INDICATOR_RED ? '--success' : '--error';
    const toggleTooltip = () => setIsTitleMatchTooltipOpen(!isTitleMatchTooltipOpen);

    const renderContent = () => {
        switch (calculateIndicatorType(data)) {
            case INDICATOR_RED:
                return (
                    <span>
                        {NO_MATCHING_TITLE}{' '}
                        <Button appearance="link" onClick={() => setSingleRightMatch([data])}>
                            {FIND_MATCH}
                        </Button>
                    </span>
                );
            case INDICATOR_SUCCESS:
                return <span>{MATCHED_TITLE}</span>;
            default:
                return <span>{ERROR_NO_CORE_TITLE_ID}</span>;
        }
    };

    return (
        <CustomActionsCellRenderer id={id}>
            <div onClick={isTooltipEnabled ? toggleTooltip : null}>
                <EditorMediaWrapLeftIcon />
                <span
                    className={classnames(
                        'nexus-c-right-to-match-view__buttons_notification',
                        `nexus-c-right-to-match-view__buttons_notification${notificationClass}`
                    )}
                />
                {isTitleMatchTooltipOpen && (
                    <div className="nexus-c-tooltip-cell-renderer__tooltip">{renderContent()}</div>
                )}
            </div>
        </CustomActionsCellRenderer>
    );
};

TooltipCellRenderer.propTypes = {
    data: PropTypes.object,
    isTooltipEnabled: PropTypes.bool,
    setSingleRightMatch: PropTypes.func,
};

TooltipCellRenderer.defaultProps = {
    data: {},
    isTooltipEnabled: true,
    setSingleRightMatch: () => null,
};

export default TooltipCellRenderer;
