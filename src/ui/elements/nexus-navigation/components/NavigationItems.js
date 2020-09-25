import React from 'react';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import EditorBulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import RecentIcon from '@atlaskit/icon/glyph/recent';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import {can} from '../../../../ability';
import NexusNavIcon from '../../../../assets/nexus-nav-icon.svg';
import {URL} from '../../../../util/Common';
import {AVAILS, METADATA, MEDIA, SERVICING_ORDERS, EVENT_MANAGEMENT, DOP_TASKS} from '../constants';

export const navigationPrimaryItems = (selectedItem, handleClick) => {
    const canReadEventManager = can('read', 'EventManagement');

    return [
        {
            component: () => <NexusNavIcon />,
            id: 'logo',
        },
        {
            icon: TrayIcon,
            id: AVAILS,
            tooltip: AVAILS,
            isSelected: selectedItem === AVAILS,
            onClick: () => handleClick(AVAILS),
        },
        {
            icon: EditorMediaWrapLeftIcon,
            id: METADATA,
            tooltip: METADATA,
            isSelected: selectedItem === METADATA,
            onClick: () => handleClick(METADATA),
        },
        {
            icon: EditorSearchIcon,
            id: MEDIA,
            tooltip: MEDIA,
            isSelected: selectedItem === MEDIA,
            onClick: () => handleClick(MEDIA),
        },
        {
            icon: TrayIcon,
            id: `${AVAILS}/v2`,
            tooltip: `${AVAILS}/v2`,
            isSelected: selectedItem === `${AVAILS}/v2`,
            onClick: () => handleClick(`${AVAILS}/v2`),
        },
        {
            icon: DetailViewIcon,
            id: SERVICING_ORDERS,
            tooltip: 'Servicing Orders',
            isSelected: selectedItem === SERVICING_ORDERS,
            onClick: () => handleClick(SERVICING_ORDERS),
        },
        ...(canReadEventManager
            ? [
                  {
                      icon: RecentIcon,
                      id: EVENT_MANAGEMENT,
                      tooltip: 'Event Management',
                      isSelected: selectedItem === EVENT_MANAGEMENT,
                      onClick: () => handleClick(EVENT_MANAGEMENT),
                  },
              ]
            : []),
        URL.isLocalOrDev() && {
            icon: () => <EditorBulletListIcon size="large" />,
            id: DOP_TASKS,
            tooltip: 'DOP Tasks',
            isSelected: selectedItem === DOP_TASKS,
            onClick: () => handleClick(DOP_TASKS),
        },
    ];
};
