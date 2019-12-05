import React from 'react';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import NexusNavIcon from '../../assets/nexus-nav-icon.svg';
import {AVAILS, METADATA, MEDIA} from '../constants';

export const navigationPrimaryItems = (selectedItem, handleClick) => [
    {
        component: () => <NexusNavIcon />,
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
];

