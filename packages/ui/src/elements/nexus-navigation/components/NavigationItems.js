import React from 'react';
import PropTypes from 'prop-types';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import EditorBulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import EditorMediaWrapRightIcon from '@atlaskit/icon/glyph/editor/media-wrap-right';
import RecentIcon from '@atlaskit/icon/glyph/recent';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import NexusNavIcon from '@portal/portal-icons/svg/VU-logo.svg';
import {AVAILS, DOP_TASKS, EVENT_MANAGEMENT, METADATA, SERVICING_ORDERS, TITLE_METADATA} from '../constants';
import './NavigationItems.scss';

export const ComponentWrapper = ({link, handleClick, children, dataset, id}) => {
    const itemId = `${id}GlobalItem`;

    return (
        <a
            href={link}
            onClick={e => {
                handleClick(link);
                e.preventDefault();
            }}
        >
            <button id={itemId} data-testid={dataset['data-testid']} className="navigation-button">
                {children}
            </button>
        </a>
    );
};

export const navigationPrimaryItems = (selectedItem, handleClick) => {
    const generateComponent = (link, Icon, props) => (
        <ComponentWrapper handleClick={handleClick} link={link} {...props}>
            <Icon />
        </ComponentWrapper>
    );
    const DopIcon = () => <EditorBulletListIcon size="large" />;

    return [
        {
            component: () => <NexusNavIcon />,
            id: 'logo',
        },
        {
            icon: TrayIcon,
            component: props => generateComponent(AVAILS, TrayIcon, props),
            id: AVAILS,
            tooltip: AVAILS,
            isSelected: selectedItem === AVAILS,
            onClick: () => handleClick(AVAILS),
            resource: 'availsMenuIcon',
        },
        {
            icon: EditorMediaWrapRightIcon,
            component: props => generateComponent(METADATA, EditorMediaWrapRightIcon, props),
            id: TITLE_METADATA,
            tooltip: 'Title Metadata',
            isSelected: selectedItem === TITLE_METADATA,
            onClick: () => handleClick(METADATA),
            resource: 'titleMetadataMenuIcon',
        },
        {
            icon: DopIcon,
            component: props => generateComponent(DOP_TASKS, DopIcon, props),
            id: DOP_TASKS,
            tooltip: 'DOP Tasks',
            isSelected: selectedItem === DOP_TASKS,
            onClick: () => handleClick(DOP_TASKS),
            resource: 'dopTasksMenuIcon',
        },
        {
            icon: DetailViewIcon,
            component: props => generateComponent(SERVICING_ORDERS, DetailViewIcon, props),
            id: SERVICING_ORDERS,
            tooltip: 'Servicing Orders',
            isSelected: selectedItem === SERVICING_ORDERS,
            onClick: () => handleClick(SERVICING_ORDERS),
            resource: 'servicingOrdersView',
        },
        {
            icon: RecentIcon,
            component: props => generateComponent(EVENT_MANAGEMENT, RecentIcon, props),
            id: EVENT_MANAGEMENT,
            tooltip: 'Event Management',
            isSelected: selectedItem === EVENT_MANAGEMENT,
            onClick: () => handleClick(EVENT_MANAGEMENT),
            resource: 'eventManagementMenuIcon',
        },
    ];
};

ComponentWrapper.propTypes = {
    link: PropTypes.string,
    id: PropTypes.string,
    handleClick: PropTypes.func,
    dataset: PropTypes.object,
};

ComponentWrapper.defaultProps = {
    link: '',
    id: '',
    dataset: {},
    handleClick: () => null,
};
