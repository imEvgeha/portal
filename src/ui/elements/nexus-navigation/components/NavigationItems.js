import React from 'react';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import RecentIcon from '@atlaskit/icon/glyph/recent';
import NexusNavIcon from '../../../../assets/nexus-nav-icon.svg';
import {URL} from '../../../../util/Common';
import {AVAILS, METADATA, MEDIA, SERVICING_ORDERS, EVENT_MANAGEMENT} from '../constants';

export const navigationPrimaryItems = (selectedItem, handleClick) => [
    {
        component: () => {
  return <NexusNavIcon />;
},
        id: 'logo',
    },
    {
        icon: TrayIcon,
        id: AVAILS,
        tooltip: AVAILS,
        isSelected: (selectedItem === AVAILS),
        onClick: () => handleClick(AVAILS),
    },
    {
        icon: EditorMediaWrapLeftIcon,
        id: METADATA,
        tooltip: METADATA,
        isSelected: (selectedItem === METADATA),
        onClick: () => handleClick(METADATA),
    },
    {
        icon: EditorSearchIcon,
        id: MEDIA,
        tooltip: MEDIA,
        isSelected: (selectedItem === MEDIA),
        onClick: () => handleClick(MEDIA),
    },
    {
        icon: TrayIcon,
        id: `${AVAILS}/v2`,
        tooltip: `${AVAILS}/v2`,
        isSelected: (selectedItem === `${AVAILS}/v2`),
        onClick: () => handleClick(`${AVAILS}/v2`),
    },
    {
        icon: DetailViewIcon,
        id: SERVICING_ORDERS,
        tooltip: 'Servicing Orders',
        isSelected: (selectedItem === SERVICING_ORDERS),
        onClick: () => handleClick(SERVICING_ORDERS),
    },
    URL.isLocalOrDevOrQA() && (
        {
            icon: RecentIcon,
            id: EVENT_MANAGEMENT,
            tooltip: 'Event Management',
            isSelected: (selectedItem === EVENT_MANAGEMENT),
            onClick: () => handleClick(EVENT_MANAGEMENT),
        }
    )
];

