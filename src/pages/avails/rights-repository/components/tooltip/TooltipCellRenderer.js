import React, {useState} from 'react';
import PropTypes from 'prop-types';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import {Button} from '@portal/portal-components';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {useDateTimeContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-time-context/NexusDateTimeProvider';
import CustomActionsCellRenderer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {getDomainName, isObjectEmpty} from '@vubiquity-nexus/portal-utils/lib/Common';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import classnames from 'classnames';
import {useParams} from 'react-router-dom';
import {calculateIndicatorType, INDICATOR_SUCCESS, INDICATOR_RED} from '../../util/indicator';
import {ERROR_NO_CORE_TITLE_ID, FIND_MATCH, MATCHED_TITLE, NO_MATCHING_TITLE, VIEW_TITLE} from './constants';
import './TooltipCellRenderer.scss';

const TooltipCellRenderer = ({data = {}, isTooltipEnabled, setSingleRightMatch}) => {
    const [isTitleMatchTooltipOpen, setIsTitleMatchTooltipOpen] = useState(false);
    const routeParams = useParams();
    const {id} = data || {};
    const indicator = calculateIndicatorType(data);
    const notificationClass = indicator !== INDICATOR_RED ? '--success' : '--error';
    const toggleTooltip = () => setIsTitleMatchTooltipOpen(!isTitleMatchTooltipOpen);
    const {renderDateTime} = useDateTimeContext();

    if (isObjectEmpty(data)) {
        return <img src={loadingGif} alt="loadingSpinner" />;
    }

    const renderContent = () => {
        switch (calculateIndicatorType(data)) {
            case INDICATOR_RED:
                return (
                    <span>
                        {NO_MATCHING_TITLE}
                        <Button
                            label={FIND_MATCH}
                            className="p-button-link mx-2 mr-0 nexus-c-right-to-match-view__button-links"
                            onClick={() => setSingleRightMatch([data])}
                        />
                    </span>
                );
            case INDICATOR_SUCCESS:
                return (
                    <span>
                        {`${MATCHED_TITLE}  ${renderDateTime(
                            data.lastUpdateReceivedAt,
                            DATETIME_FIELDS.BUSINESS_DATETIME,
                            true,
                            true
                        )}`}
                        <Button
                            label={VIEW_TITLE}
                            className="p-button-link mx-2 mr-0 nexus-c-right-to-match-view__button-links"
                            onClick={() =>
                                window.open(
                                    `${getDomainName()}/${routeParams.realm}/metadata/detail/${data.coreTitleId}`,
                                    '_blank'
                                )
                            }
                        />
                    </span>
                );
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
